function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "12px",
        padding: "20px",
        minWidth: "220px",
      }}
    >
      <h3 style={{ color: "#94a3b8", marginBottom: "10px" }}>{title}</h3>

      <h1 style={{ color: "#fff", fontSize: "34px" }}>{value}</h1>
    </div>
  );
}

export default StatCard;