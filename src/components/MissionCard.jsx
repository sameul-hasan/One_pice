export default function MissionCard({ mission, onAccept }) {
  return (
    <div className="mission-card">
      <span className="mission-type">{mission.type}</span>
      <h3>{mission.title}</h3>
      <p>{mission.description}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
        <span className="mission-reward">💰 +{mission.points}</span>
        {onAccept && (
          <button
            className="btn-admin create"
            style={{ marginRight: 0 }}
            onClick={() => onAccept(mission)}
          >
            Accept
          </button>
        )}
      </div>
    </div>
  );
}
