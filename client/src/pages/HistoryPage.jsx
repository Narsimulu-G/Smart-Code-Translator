import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getHistory, deleteHistory, clearHistory } from "../services/historyService.js";
import { getLanguageName } from "../constants/languages.js";
import "../styles/history.css";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this history item?")) return;

    try {
      await deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast.success("History item deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete.");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire translation history? This cannot be undone.")) return;

    try {
      await clearHistory();
      setHistory([]);
      toast.success("All history cleared.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to clear history.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="history-container main-content">
      <div className="history-header">
        <h1 className="history-title">Operation History</h1>
        {history.length > 0 && (
          <button onClick={handleClearAll} className="btn btn-secondary" style={{ borderColor: "var(--error)", color: "var(--error)" }}>
            Clear All History
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state" style={{ height: "40vh" }}>
          <div className="spinner" />
        </div>
      ) : history.length === 0 ? (
        <div className="empty-history-state glass-card">
          <span className="empty-history-icon">⏱</span>
          <h2>No operations logged yet</h2>
          <p>Go back to the Editor and run translations, complexity analysis, or optimizations to see logs here.</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item) => (
            <div key={item._id} className="history-card glass-card" onClick={() => setSelectedEntry(item)} style={{ cursor: "pointer" }}>
              <div className="history-card-top">
                <span className={`op-badge badge-${item.operationType}`}>
                  {item.operationType}
                </span>
                <span className="history-date">{formatDate(item.createdAt)}</span>
              </div>

              <div className="history-card-body">
                <div className="history-langs-flow">
                  <span>{getLanguageName(item.inputLanguage)}</span>
                  {item.operationType === "translate" && (
                    <>
                      <span className="history-langs-arrow">⇄</span>
                      <span>{getLanguageName(item.targetLanguage)}</span>
                    </>
                  )}
                </div>
                <div className="history-code-preview">
                  {item.inputCode.trim().substring(0, 150)}
                  {item.inputCode.length > 150 ? "..." : ""}
                </div>
              </div>

              <div className="history-card-actions">
                <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "600" }}>View Details →</span>
                <button onClick={(e) => handleDelete(e, item._id)} className="btn-card-delete" title="Delete entry">
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEntry && (
        <div className="modal-backdrop" onClick={() => setSelectedEntry(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <span className={`op-badge badge-${selectedEntry.operationType}`}>{selectedEntry.operationType}</span>
                <span>Operation Details</span>
              </h2>
              <button className="btn-close-modal" onClick={() => setSelectedEntry(null)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <span className="modal-section-title">Date & Time</span>
                <div style={{ color: "var(--text-muted)" }}>{formatDate(selectedEntry.createdAt)}</div>
              </div>

              <div className="modal-section">
                <span className="modal-section-title">Input Code ({getLanguageName(selectedEntry.inputLanguage)})</span>
                <pre className="modal-code-block">{selectedEntry.inputCode}</pre>
              </div>

              {selectedEntry.operationType === "translate" && (
                <div className="modal-section">
                  <span className="modal-section-title">Translated Code ({getLanguageName(selectedEntry.targetLanguage)})</span>
                  <pre className="modal-code-block" style={{ borderLeft: "4px solid var(--primary)" }}>
                    {selectedEntry.output?.translatedCode}
                  </pre>
                </div>
              )}

              {selectedEntry.operationType === "analyze" && (
                <div className="modal-section">
                  <span className="modal-section-title">Complexity Analysis</span>
                  <div className="complexity-card-grid" style={{ margin: "0.5rem 0" }}>
                    <div className="complexity-card" style={{ background: "var(--bg-tertiary)" }}>
                      <div className="complexity-label">Time Complexity</div>
                      <div className="complexity-value" style={{ fontSize: "1.2rem" }}>{selectedEntry.output?.timeComplexity}</div>
                    </div>
                    <div className="complexity-card" style={{ background: "var(--bg-tertiary)" }}>
                      <div className="complexity-label">Space Complexity</div>
                      <div className="complexity-value" style={{ fontSize: "1.2rem" }}>{selectedEntry.output?.spaceComplexity}</div>
                    </div>
                  </div>
                  <div className="analysis-details-header">Details</div>
                  <div className="analysis-details-content">{selectedEntry.output?.explanation}</div>
                </div>
              )}

              {selectedEntry.operationType === "optimize" && (
                <div className="modal-section">
                  <span className="modal-section-title">Optimized Code</span>
                  <pre className="modal-code-block" style={{ borderLeft: "4px solid var(--secondary)", marginBottom: "0.5rem" }}>
                    {selectedEntry.output?.optimizedCode}
                  </pre>
                  <span className="modal-section-title">Improvements</span>
                  <div className="analysis-details-content">
                    <ul className="suggestions-list">
                      {selectedEntry.output?.suggestions?.split("\n").filter(Boolean).map((sug, i) => (
                        <li key={i}>{sug.replace(/^[•\-\*]\s*/, "")}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedEntry.operationType === "explain" && (
                <div className="modal-section">
                  <span className="modal-section-title">AI Explanation</span>
                  <div className="analysis-details-content" style={{ lineHeight: "1.6" }}>{selectedEntry.output?.explanation}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
