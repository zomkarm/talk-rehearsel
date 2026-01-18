-- CreateTable
CREATE TABLE "public"."practice_schedules" (
    "id" TEXT NOT NULL,
    "host_user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "room_provider" TEXT NOT NULL,
    "room_link" TEXT,
    "max_participants" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schedule_requests" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "practice_schedules_host_user_id_idx" ON "public"."practice_schedules"("host_user_id");

-- CreateIndex
CREATE INDEX "practice_schedules_scheduled_at_idx" ON "public"."practice_schedules"("scheduled_at");

-- CreateIndex
CREATE INDEX "schedule_requests_schedule_id_idx" ON "public"."schedule_requests"("schedule_id");

-- CreateIndex
CREATE INDEX "schedule_requests_user_id_idx" ON "public"."schedule_requests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_requests_schedule_id_user_id_key" ON "public"."schedule_requests"("schedule_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."schedule_requests" ADD CONSTRAINT "schedule_requests_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."practice_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
