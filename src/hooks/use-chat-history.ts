import { useState, useCallback } from "react";
import {
  ChatSession,
  Message,
  ChatHistoryState,
  ChatHistoryActions,
} from "@/types/chat";
import { ChatHistoryService } from "@/lib/chat-history-service";

export function useChatHistory(): ChatHistoryState & ChatHistoryActions {
  const [state, setState] = useState<ChatHistoryState>({
    sessions: [],
    currentSession: null,
    isLoading: false,
    error: null,
  });

  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [loadedChats, setLoadedChats] = useState<Set<string>>(new Set());

  const loadSessions = useCallback(
    async (forceRefresh = false) => {
      // Don't load if already loaded and not forcing refresh
      if (sessionsLoaded && !forceRefresh) {
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const sessions = await ChatHistoryService.getChatSessions(forceRefresh);
        setState((prev) => ({ ...prev, sessions, isLoading: false }));
        setSessionsLoaded(true);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to load sessions",
          isLoading: false,
        }));
      }
    },
    [sessionsLoaded]
  );

  const createSession = useCallback(
    async (title: string, initialMessage?: Message): Promise<ChatSession> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const newSession = await ChatHistoryService.createChatSession(
          title,
          initialMessage
        );
        setState((prev) => ({
          ...prev,
          sessions: [newSession, ...prev.sessions],
          currentSession: newSession,
          isLoading: false,
        }));
        return newSession;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to create session",
          isLoading: false,
        }));
        throw error;
      }
    },
    []
  );

  const selectSession = useCallback(
    async (sessionId: string, forceRefresh = false) => {
      // Don't load if already loaded and not forcing refresh
      if (
        loadedChats.has(sessionId) &&
        !forceRefresh &&
        state.currentSession?.id === sessionId
      ) {
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const session = await ChatHistoryService.getChatSession(
          sessionId,
          forceRefresh
        );
        if (session) {
          setState((prev) => ({
            ...prev,
            currentSession: session,
            isLoading: false,
          }));
          setLoadedChats((prev) => new Set(prev).add(sessionId));
        } else {
          setState((prev) => ({
            ...prev,
            error: "Session not found",
            isLoading: false,
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to load session",
          isLoading: false,
        }));
      }
    },
    [loadedChats, state.currentSession?.id]
  );

  const updateSession = useCallback(
    async (sessionId: string, updates: Partial<ChatSession>) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const updatedSession = await ChatHistoryService.updateChatSession(
          sessionId,
          updates
        );
        if (updatedSession) {
          setState((prev) => ({
            ...prev,
            sessions: prev.sessions.map((session) =>
              session.id === sessionId ? updatedSession : session
            ),
            currentSession:
              prev.currentSession?.id === sessionId
                ? updatedSession
                : prev.currentSession,
            isLoading: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: "Failed to update session",
            isLoading: false,
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to update session",
          isLoading: false,
        }));
      }
    },
    []
  );

  const deleteSession = useCallback(async (sessionId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const success = await ChatHistoryService.deleteChatSession(sessionId);
      if (success) {
        setState((prev) => ({
          ...prev,
          sessions: prev.sessions.filter((session) => session.id !== sessionId),
          currentSession:
            prev.currentSession?.id === sessionId ? null : prev.currentSession,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: "Failed to delete session",
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to delete session",
        isLoading: false,
      }));
    }
  }, []);

  const addMessage = useCallback(
    async (sessionId: string, message: Message) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const updatedSession = await ChatHistoryService.addMessageToSession(
          sessionId,
          message
        );
        if (updatedSession) {
          setState((prev) => ({
            ...prev,
            sessions: prev.sessions.map((session) =>
              session.id === sessionId ? updatedSession : session
            ),
            currentSession:
              prev.currentSession?.id === sessionId
                ? updatedSession
                : prev.currentSession,
            isLoading: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: "Failed to add message",
            isLoading: false,
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to add message",
          isLoading: false,
        }));
      }
    },
    []
  );

  // Add message to current session without API call (for real-time updates)
  const addMessageToCurrentSession = useCallback((message: Message) => {
    setState((prev) => {
      if (prev.currentSession) {
        const updatedSession = {
          ...prev.currentSession,
          messages: [...prev.currentSession.messages, message],
          updatedAt: new Date(),
        };

        return {
          ...prev,
          currentSession: updatedSession,
          sessions: prev.sessions.map((session) =>
            session.id === prev.currentSession!.id ? updatedSession : session
          ),
        };
      }
      return prev;
    });
  }, []);

  const searchSessions = useCallback(
    async (query: string): Promise<ChatSession[]> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const sessions = await ChatHistoryService.searchChatSessions(query);
        setState((prev) => ({ ...prev, sessions, isLoading: false }));
        return sessions;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Failed to search sessions",
          isLoading: false,
        }));
        return [];
      }
    },
    []
  );

  return {
    ...state,
    loadSessions,
    createSession,
    selectSession,
    updateSession,
    deleteSession,
    addMessage,
    addMessageToCurrentSession,
    searchSessions,
  };
}
