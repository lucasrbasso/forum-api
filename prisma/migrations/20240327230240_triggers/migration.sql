-- CreateTable
CREATE TABLE "users_audit" (
    "id" SERIAL NOT NULL,
    "version_operation" TEXT NOT NULL,
    "version_table_id" TEXT,
    "version_timestamp" TIMESTAMP(3) NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,

    CONSTRAINT "users_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions_audit" (
    "id" SERIAL NOT NULL,
    "version_operation" TEXT NOT NULL,
    "version_table_id" TEXT,
    "version_timestamp" TIMESTAMP(3) NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,

    CONSTRAINT "questions_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers_audit" (
    "id" SERIAL NOT NULL,
    "version_operation" TEXT NOT NULL,
    "version_table_id" TEXT,
    "version_timestamp" TIMESTAMP(3) NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,

    CONSTRAINT "answers_audit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_audit" ADD CONSTRAINT "users_audit_version_table_id_fkey" FOREIGN KEY ("version_table_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions_audit" ADD CONSTRAINT "questions_audit_version_table_id_fkey" FOREIGN KEY ("version_table_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers_audit" ADD CONSTRAINT "answers_audit_version_table_id_fkey" FOREIGN KEY ("version_table_id") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- audit trigger function
CREATE OR REPLACE FUNCTION audit_function_for_users() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO "public"."users_audit"
            VALUES (DEFAULT, 'DELETE', NULL, now(), row_to_json(OLD.*), null);
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO "public"."users_audit"
            VALUES (DEFAULT, 'UPDATE', NEW.id, now(), row_to_json(OLD.*), row_to_json(NEW.*));
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO "public"."users_audit"
            VALUES (DEFAULT, 'INSERT', NEW.id, now(), null, row_to_json(NEW.*));
        END IF;
        RETURN NULL;
    END;
$$ LANGUAGE plpgsql;

-- trigger
CREATE TRIGGER audit_function_for_table
AFTER INSERT OR UPDATE OR DELETE ON  "public"."users"
    FOR EACH ROW EXECUTE FUNCTION audit_function_for_users();

-- audit trigger function
CREATE OR REPLACE FUNCTION audit_function_for_questions() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO "public"."questions_audit"
            VALUES (DEFAULT, 'DELETE', NULL, now(), row_to_json(OLD.*), null);
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO "public"."questions_audit"
            VALUES (DEFAULT, 'UPDATE', NEW.id, now(), row_to_json(OLD.*), row_to_json(NEW.*));
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO "public"."questions_audit"
            VALUES (DEFAULT, 'INSERT', NEW.id, now(), null, row_to_json(NEW.*));
        END IF;
        RETURN NULL;
    END;
$$ LANGUAGE plpgsql;

-- trigger
CREATE TRIGGER audit_function_for_questions
AFTER INSERT OR UPDATE OR DELETE ON  "public"."questions"
    FOR EACH ROW EXECUTE FUNCTION audit_function_for_questions();

-- audit trigger function
CREATE OR REPLACE FUNCTION audit_function_for_answers() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO "public"."answers_audit"
            VALUES (DEFAULT, 'DELETE', NULL, now(), row_to_json(OLD.*), null);
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO "public"."answers_audit"
            VALUES (DEFAULT, 'UPDATE', NEW.id, now(), row_to_json(OLD.*), row_to_json(NEW.*));
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO "public"."answers_audit"
            VALUES (DEFAULT, 'INSERT', NEW.id, now(), null, row_to_json(NEW.*));
        END IF;
        RETURN NULL;
    END;
$$ LANGUAGE plpgsql;

-- trigger
CREATE TRIGGER audit_function_for_answers
AFTER INSERT OR UPDATE OR DELETE ON  "public"."answers"
    FOR EACH ROW EXECUTE FUNCTION audit_function_for_answers();
