export const categorizeChatsByDate = (chats) => {
  const today = []; const week = []; const older = [];
  const now = new Date();
  
  chats.forEach(chat => {
    const chatDate = new Date(chat.updatedAt || chat.createdAt || Date.now());
    const diffTime = Math.abs(now - chatDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) today.push(chat);
    else if (diffDays <= 7) week.push(chat);
    else older.push(chat);
  });
  
  return { today, week, older };
};