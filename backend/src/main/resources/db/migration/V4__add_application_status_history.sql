CREATE TABLE application_status_history (
                                            id BIGSERIAL PRIMARY KEY,
                                            application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
                                            status VARCHAR(20) NOT NULL,
                                            changed_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_history_application_id ON application_status_history(application_id);


INSERT INTO application_status_history (application_id, status, changed_at)
SELECT id, 'APPLIED', applied_date::timestamp FROM applications;


INSERT INTO application_status_history (application_id, status, changed_at)
SELECT id, status, COALESCE(last_updated, applied_date)::timestamp
FROM applications
WHERE status != 'APPLIED';