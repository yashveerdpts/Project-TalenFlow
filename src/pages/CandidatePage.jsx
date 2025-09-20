// src/pages/CandidatesPage.jsx
import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Link is already here!
import { CandidatesContext } from '../context/CandidatesContext';
import { AutoSizer, List } from 'react-virtualized';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'react-virtualized/styles.css';
import './CandidatesPage.css';

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"];

const CandidatesPage = () => {
    const { candidates, loading, error, updateCandidateStage } = useContext(CandidatesContext);
    const [search, setSearch] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [view, setView] = useState('list'); // 'list' or 'kanban'

    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => {
            const searchLower = search.toLowerCase();
            const matchesSearch = c.name.toLowerCase().includes(searchLower) || c.email.toLowerCase().includes(searchLower);
            const matchesFilter = stageFilter ? c.stage === stageFilter : true;
            return matchesSearch && matchesFilter;
        });
    }, [candidates, search, stageFilter]);

    const handleOnDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }
        updateCandidateStage(draggableId, destination.droppableId);
    };

    // rowRenderer for the virtualized list view
    const rowRenderer = ({ key, index, style }) => {
        const candidate = filteredCandidates[index];
        return (
            <div key={key} style={style} className="candidate-row">
                <Link to={`/candidates/${candidate.id}`} className="candidate-link">
                    <strong>{candidate.name}</strong>
                    <p>{candidate.email}</p>
                </Link>
                <span className="stage-badge">{candidate.stage}</span>
            </div>
        );
    };

    if (loading) return <div>Loading candidates...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="candidates-page">
            <h1>Candidates</h1>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {view === 'list' && (
                    <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
                        <option value="">All Stages</option>
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                )}
                <button onClick={() => setView(view === 'list' ? 'kanban' : 'list')}>
                    Switch to {view === 'list' ? 'Kanban' : 'List'} View
                </button>
            </div>

            {view === 'list' ? (
                <div className="list-container">
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={filteredCandidates.length}
                                rowHeight={70}
                                rowRenderer={rowRenderer}
                                overscanRowCount={10}
                            />
                        )}
                    </AutoSizer>
                </div>
            ) : (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <div className="kanban-board">
                        {STAGES.map(stage => (
                            <Droppable key={stage} droppableId={stage}>
                                {(provided, snapshot) => (
                                    <div
                                        className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <h2>{stage} ({filteredCandidates.filter(c => c.stage === stage).length})</h2>
                                        <div className="card-list">
                                            {filteredCandidates
                                                .filter(c => c.stage === stage)
                                                .map((candidate, index) => (
                                                    <Draggable key={candidate.id} draggableId={candidate.id.toString()} index={index}>
                                                        {(provided, snapshot) => (
                                                            // *** MODIFICATION START ***
                                                            // We wrap the draggable div with a Link component
                                                            <Link to={`/candidates/${candidate.id}`} className="kanban-card-link">
                                                                <div
                                                                    className={`kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <strong>{candidate.name}</strong>
                                                                    <p>{candidate.email}</p>
                                                                </div>
                                                            </Link>
                                                            // *** MODIFICATION END ***
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            )}
        </div>
    );
};

export default CandidatesPage;