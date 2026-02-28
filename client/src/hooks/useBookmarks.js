import { useLocalStorage } from "./useLocalStorage";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useLocalStorage("aethel_bookmarks", []);

  const toggleBookmark = (message, chatId) => {
    const id = `${chatId}_${message.content.substring(0, 20)}`;
    const exists = bookmarks.find(b => b.id === id);

    if (exists) {
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } else {
      setBookmarks([...bookmarks, { id, chatId, content: message.content, timestamp: Date.now() }]);
    }
  };

  const isBookmarked = (message, chatId) => {
    const id = `${chatId}_${message.content.substring(0, 20)}`;
    return bookmarks.some(b => b.id === id);
  };

  const clearBookmarks = () => setBookmarks([]);

  return { bookmarks, toggleBookmark, isBookmarked, clearBookmarks };
};