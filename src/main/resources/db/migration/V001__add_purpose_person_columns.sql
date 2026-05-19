-- Add primary_purpose_person_id and secondary_purpose_person_id columns to resolutions table

ALTER TABLE resolutions
ADD COLUMN primary_purpose_person_id BIGINT,
ADD COLUMN secondary_purpose_person_id BIGINT;

-- Add foreign key constraints
ALTER TABLE resolutions
ADD CONSTRAINT fk_resolutions_primary_purpose_person
    FOREIGN KEY (primary_purpose_person_id) REFERENCES users(id);

ALTER TABLE resolutions
ADD CONSTRAINT fk_resolutions_secondary_purpose_person
    FOREIGN KEY (secondary_purpose_person_id) REFERENCES users(id);
