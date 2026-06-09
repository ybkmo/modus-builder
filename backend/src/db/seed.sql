INSERT INTO users (email, password_hash, name)
VALUES ('demo@modus.app', '$2a$10$hashed', 'Demo User');

INSERT INTO projects (user_id, name, template_id, blocks)
VALUES (1, 'MODUS Agency Site', 'agency', '[
  {"type":"navbar","content":{"logo":"MODUS","links":["Home","Work","About","Contact"]}},
  {"type":"hero","content":{"title":"We build digital experiences","subtitle":"Award-winning agency based in London"}},
  {"type":"features","content":{"items":["Strategy","Design","Development"]}},
  {"type":"gallery","content":{"images":["project1.jpg","project2.jpg","project3.jpg"]}},
  {"type":"testimonials","content":{"quotes":["Best team ever!","Delivered on time"]}},
  {"type":"stats","content":{"figures":[{"label":"Clients","value":"150+"},{"label":"Projects","value":"300+"]}},
  {"type":"pricing","content":{"plans":[{"name":"Starter","price":"£999"},{"name":"Pro","price":"£2,499"]}},
  {"type":"form","content":{"fields":["Name","Email","Message"],"button":"Send"}}
]');
