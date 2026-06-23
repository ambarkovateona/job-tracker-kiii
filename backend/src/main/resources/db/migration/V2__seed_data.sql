INSERT INTO companies (name, industry) VALUES
                                           ('Google', 'IT'),
                                           ('Microsoft', 'IT'),
                                           ('Amazon', 'IT'),
                                           ('Netcetera', 'IT'),
                                           ('Endava', 'IT'),
                                           ('Seavus', 'IT');

-- Demo user: demo@jobtracker.com / demo123
INSERT INTO users (email, password, first_name, last_name) VALUES
    ('demo@jobtracker.com', '$2b$10$WmE3qfov4aNlx1/Px4UPDud/ThkDlswC9M5vu4l2KIkDeUL2WFDIe', 'Demo', 'User');

INSERT INTO applications (user_id, company_id, position, status, applied_date, last_updated, notes)
SELECT u.id, c.id, 'Software Engineering Intern', 'INTERVIEW', '2026-06-01', '2026-06-10', 'First round went well'
FROM users u, companies c
WHERE u.email = 'demo@jobtracker.com' AND c.name = 'Netcetera';

INSERT INTO applications (user_id, company_id, position, status, applied_date, last_updated, notes)
SELECT u.id, c.id, '.NET Developer Intern', 'APPLIED', '2026-06-15', NULL, NULL
FROM users u, companies c
WHERE u.email = 'demo@jobtracker.com' AND c.name = 'Endava';

INSERT INTO applications (user_id, company_id, position, status, applied_date, last_updated, notes)
SELECT u.id, c.id, 'Backend Developer Intern', 'REJECTED', '2026-05-10', '2026-05-25', 'Position got filled internally'
FROM users u, companies c
WHERE u.email = 'demo@jobtracker.com' AND c.name = 'Google';