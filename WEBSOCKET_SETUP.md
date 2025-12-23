Cách hoạt động:
WebSocket: Kết nối và subscribe vào /user/{userId}/queue/notifications để nhận notifications real-time
Like/Unlike: Luôn dùng REST API POST /api/videos/{id}/like?liker_id={likerId} (backend tự toggle)
Notifications: Khi có người like video của bạn, bạn sẽ nhận notification qua WebSocket