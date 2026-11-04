import ChatHistory from "../models/ChatHistory.js";

export async function createChatHistory(req, res) {
  const { query, classification, execution } = req.body;

  if (
    typeof query !== "string" ||
    !query.trim() ||
    !classification ||
    !execution ||
    typeof execution.message !== "string"
  ) {
    return res.status(400).json({ message: "A complete chat entry is required." });
  }

  try {
    const entry = await ChatHistory.create({
      query: query.trim().slice(0, 2000),
      classification,
      execution,
    });
    return res.status(201).json({
      entry: {
        id: entry._id.toString(),
        query: entry.query,
        classification: entry.classification,
        execution: entry.execution,
        timestamp: entry.createdAt,
      },
    });
  } catch (error) {
    console.error("Chat history creation error:", error);
    return res.status(500).json({ message: "Could not save chat history." });
  }
}

export async function listChatHistory(req, res) {
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 100)
    : null;

  try {
    let query = ChatHistory.find().sort({ createdAt: -1 });
    if (limit) query = query.limit(limit);
    const entries = await query.lean();

    return res.json(entries.map((entry) => ({
      id: entry._id.toString(),
      query: entry.query,
      classification: entry.classification,
      execution: entry.execution,
      timestamp: entry.createdAt,
    })));
  } catch (error) {
    console.error("Chat history load error:", error);
    return res.status(500).json({ message: "Could not load chat history." });
  }
}
