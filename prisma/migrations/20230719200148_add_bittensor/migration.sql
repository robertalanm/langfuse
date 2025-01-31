-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "projectId" TEXT NOT NULL,
    "coldkeyId" TEXT NOT NULL,
    "hotkeyId" TEXT NOT NULL,
    "registered" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coldkeys" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ss58" TEXT NOT NULL,
    "pubfile" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "coldkeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotkeys" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ss58" TEXT NOT NULL,
    "pubfile" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "hotkeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neurons" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coldkey" TEXT NOT NULL DEFAULT '',
    "hotkey" TEXT NOT NULL DEFAULT '',
    "uid" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "stake" INTEGER NOT NULL,
    "emission" INTEGER NOT NULL,
    "incentive" INTEGER NOT NULL,
    "consensus" INTEGER NOT NULL,
    "trust" INTEGER NOT NULL,
    "netuid" INTEGER NOT NULL DEFAULT 1,
    "registered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "neurons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_coldkeyId_fkey" FOREIGN KEY ("coldkeyId") REFERENCES "coldkeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_hotkeyId_fkey" FOREIGN KEY ("hotkeyId") REFERENCES "hotkeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coldkeys" ADD CONSTRAINT "coldkeys_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotkeys" ADD CONSTRAINT "hotkeys_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neurons" ADD CONSTRAINT "neurons_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
