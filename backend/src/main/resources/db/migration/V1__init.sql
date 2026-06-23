-- V1__init.sql

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL
);

CREATE TABLE companies (
                           id BIGSERIAL PRIMARY KEY,
                           name VARCHAR(255) NOT NULL UNIQUE,
                           industry VARCHAR(100)
);

CREATE TABLE applications (
                              id BIGSERIAL PRIMARY KEY,
                              user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                              company_id BIGINT NOT NULL REFERENCES companies(id),
                              position VARCHAR(255) NOT NULL,
                              status VARCHAR(20) NOT NULL CHECK (status IN ('APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN')),
                              applied_date DATE NOT NULL,
                              last_updated DATE,
                              notes TEXT
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_company_id ON applications(company_id);