START TRANSACTION;

INSERT INTO rooms (name, latitude, longitude)
VALUES
  ('Board Room A', 12.9716, 77.5946),
  ('Conference Hall B', 13.0827, 80.2707);

SET @room1 = LAST_INSERT_ID() - 1;
SET @room2 = LAST_INSERT_ID();

INSERT INTO users (name, email, role)
VALUES
  ('Siva Vishnu', 'sivavishnu@lsvt.com', 'ADMIN'),
  ('Krishna V', 'krishna@lsvt.com', 'USER'),
  ('Archana V', 'archana@lsvt.com', 'USER');

SET @user1 = LAST_INSERT_ID() - 2;
SET @user2 = LAST_INSERT_ID() - 1;
SET @user3 = LAST_INSERT_ID();

INSERT INTO resolutions (title, description, room_id, status, created_at, updated_at)
VALUES
  ('Adopt new voting policy', 'Adopt the updated voting policy for the board.', @room1, 'DRAFT', UTC_TIMESTAMP(), UTC_TIMESTAMP());

COMMIT;
