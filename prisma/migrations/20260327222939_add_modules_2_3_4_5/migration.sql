-- CreateTable
CREATE TABLE "licitacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "process" TEXT,
    "modalidade" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ABERTA',
    "estimated_value" REAL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "uf" TEXT,
    "city" TEXT,
    "organ" TEXT,
    "organ_cnpj" TEXT,
    "original_url" TEXT NOT NULL,
    "edital_url" TEXT,
    "source_id" TEXT NOT NULL,
    "category_id" TEXT,
    "open_date" DATETIME,
    "close_date" DATETIME,
    "published_at" DATETIME NOT NULL,
    "fetched_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "relevance_score" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "licitacoes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "licitacao_sources" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "licitacoes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "licitacao_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "licitacao_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "fetch_method" TEXT NOT NULL,
    "fetch_config" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_fetch_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "licitacao_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "keywords" TEXT
);

-- CreateTable
CREATE TABLE "saved_licitacoes" (
    "user_id" TEXT NOT NULL,
    "licitacao_id" TEXT NOT NULL,
    "saved_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id", "licitacao_id"),
    CONSTRAINT "saved_licitacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "saved_licitacoes_licitacao_id_fkey" FOREIGN KEY ("licitacao_id") REFERENCES "licitacoes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "licitacao_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "uf" TEXT,
    "modalidade" TEXT,
    "min_value" REAL,
    "max_value" REAL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "licitacao_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "licitacao_fetch_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source_id" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "licitacoes_found" INTEGER NOT NULL DEFAULT 0,
    "licitacoes_new" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "duration" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "legislation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_title" TEXT,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT,
    "issuing_body" TEXT,
    "document_url" TEXT,
    "published_at" DATETIME NOT NULL,
    "effective_at" DATETIME,
    "category_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "legislation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "legislation_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "legislation_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT
);

-- CreateTable
CREATE TABLE "regulatory_agencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "uf" TEXT,
    "website_url" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "news_source_id" TEXT,
    CONSTRAINT "regulatory_agencies_news_source_id_fkey" FOREIGN KEY ("news_source_id") REFERENCES "news_sources" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "licitacoes_slug_key" ON "licitacoes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "licitacoes_original_url_key" ON "licitacoes"("original_url");

-- CreateIndex
CREATE INDEX "licitacoes_published_at_idx" ON "licitacoes"("published_at");

-- CreateIndex
CREATE INDEX "licitacoes_status_published_at_idx" ON "licitacoes"("status", "published_at");

-- CreateIndex
CREATE INDEX "licitacoes_uf_idx" ON "licitacoes"("uf");

-- CreateIndex
CREATE INDEX "licitacoes_modalidade_idx" ON "licitacoes"("modalidade");

-- CreateIndex
CREATE INDEX "licitacoes_category_id_idx" ON "licitacoes"("category_id");

-- CreateIndex
CREATE INDEX "licitacoes_source_id_idx" ON "licitacoes"("source_id");

-- CreateIndex
CREATE UNIQUE INDEX "licitacao_sources_name_key" ON "licitacao_sources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "licitacao_sources_slug_key" ON "licitacao_sources"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "licitacao_categories_name_key" ON "licitacao_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "licitacao_categories_slug_key" ON "licitacao_categories"("slug");

-- CreateIndex
CREATE INDEX "licitacao_alerts_user_id_idx" ON "licitacao_alerts"("user_id");

-- CreateIndex
CREATE INDEX "licitacao_fetch_logs_created_at_idx" ON "licitacao_fetch_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "legislation_slug_key" ON "legislation"("slug");

-- CreateIndex
CREATE INDEX "legislation_type_idx" ON "legislation"("type");

-- CreateIndex
CREATE INDEX "legislation_category_id_idx" ON "legislation"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "legislation_categories_name_key" ON "legislation_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "legislation_categories_slug_key" ON "legislation_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_agencies_name_key" ON "regulatory_agencies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_agencies_slug_key" ON "regulatory_agencies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_agencies_news_source_id_key" ON "regulatory_agencies"("news_source_id");

-- CreateIndex
CREATE INDEX "regulatory_agencies_region_idx" ON "regulatory_agencies"("region");
