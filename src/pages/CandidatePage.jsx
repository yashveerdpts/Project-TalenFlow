import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CandidatesContext } from '../context/CandidatesContext';
import { AutoSizer, List } from 'react-virtualized';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProfileAvatar from '../components/ProfileAvatar';
import 'react-virtualized/styles.css';
import './CandidatesPage.css';

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
  </svg>
);

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"];

const CandidatesPage = () => {
  const { candidates, loading, error, updateCandidateStage } = useContext(CandidatesContext);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [view, setView] = useState('list');

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
        const searchLower = search.toLowerCase();
        const matchesSearch = c.name.toLowerCase().includes(searchLower) || c.email.toLowerCase().includes(searchLower);
        // Only apply the stage filter when in list view
        const matchesFilter = view === 'list' && stageFilter ? c.stage === stageFilter : true;
        return matchesSearch && matchesFilter;
    });
  }, [candidates, search, stageFilter, view]);

  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
        return;
    }
    updateCandidateStage(draggableId, destination.droppableId);
  };

  const rowRenderer = ({ key, index, style }) => {
    const candidate = filteredCandidates[index];
    return (
      <div key={key} style={style} className="candidate-row">
        <Link to={`/candidates/${candidate.id}`} className="candidate-link">
          <ProfileAvatar name={candidate.name} />
          <div className="candidate-info">
            <strong>{candidate.name}</strong>
            <p><MailIcon /> {candidate.email}</p>
          </div>
        </Link>
        <span className={`status-badge status-${candidate.stage.toLowerCase()}`}>{candidate.stage}</span>
      </div>
    );
  };

  if (loading) return <div className="message-container">Loading candidates...</div>;
  if (error) return <div className="message-container">Error: {error}</div>;

  return (
    <div className="candidates-page">
      <h1>Candidates</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
        {view === 'list' && (
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="filter-select">
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <button onClick={() => setView(view === 'list' ? 'kanban' : 'list')} className="btn btn-primary">
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
            {STAGES.map(stage => {
              // Filter candidates for this specific stage inside the map function
              const candidatesInStage = filteredCandidates.filter(c => c.stage === stage);
              return (
                <Droppable key={stage} droppableId={stage}>
                  {(provided, snapshot) => (
                    <div className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`} ref={provided.innerRef} {...provided.droppableProps}>
                      <h2>{stage} ({candidatesInStage.length})</h2>
                      <div className="card-list">
                        {candidatesInStage.map((candidate, index) => (
                          <Draggable key={candidate.id} draggableId={candidate.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <Link to={`/candidates/${candidate.id}`} className="kanban-card-link">
                                <div className={`kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <div className="kanban-card-header">
                                    <ProfileAvatar name={candidate.name} />
                                    <strong>{candidate.name}</strong>
                                  </div>
                                  <p className="kanban-card-email"><MailIcon /> {candidate.email}</p>
                                </div>
                              </Link>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              )
            })}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default CandidatesPage;