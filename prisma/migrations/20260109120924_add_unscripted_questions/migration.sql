-- CreateTable
CREATE TABLE "public"."unscripted_question" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unscripted_question_pkey" PRIMARY KEY ("id")
);
