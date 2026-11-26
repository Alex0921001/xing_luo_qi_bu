// SQLite 建表语句（方言已从 MySQL 改过来）
// 采用 IF NOT EXISTS，首次启动和后续版本升级都能安全重复执行
export const SCHEMA_SQL = `
-- 自动排盘记录
CREATE TABLE IF NOT EXISTS \`autolist\` (
  \`Id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT,
  \`birthday\` TEXT,
  \`birthtime\` TEXT,
  \`address\` TEXT,
  \`sex\` TEXT,
  \`tag\` TEXT,
  \`comment\` TEXT,
  \`lng\` REAL,
  \`lat\` REAL,
  \`create_time\` TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 手动排盘记录（settings 存整张盘的 JSON）
CREATE TABLE IF NOT EXISTS \`noautolist\` (
  \`Id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT,
  \`sex\` TEXT,
  \`tag\` TEXT,
  \`comment\` TEXT,
  \`settings\` TEXT,
  \`shengniangan\` TEXT,
  \`create_time\` TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 星曜字典
CREATE TABLE IF NOT EXISTS \`stars\` (
  \`Id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT NOT NULL,
  \`type\` TEXT,
  \`subType\` TEXT,
  \`x\` TEXT,
  \`y\` TEXT,
  \`comment\` TEXT,
  \`isDeleted\` INTEGER DEFAULT 0,
  \`create_time\` TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 宫位字典
CREATE TABLE IF NOT EXISTS \`boxs\` (
  \`Id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT NOT NULL,
  \`type\` TEXT,
  \`subType\` TEXT,
  \`fullName\` TEXT,
  \`x\` TEXT,
  \`y\` TEXT,
  \`comment\` TEXT
);

-- 天干字典
CREATE TABLE IF NOT EXISTS \`gans\` (
  \`Id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT NOT NULL,
  \`type\` TEXT,
  \`subType\` TEXT,
  \`fullName\` TEXT,
  \`x\` TEXT,
  \`y\` TEXT,
  \`comment\` TEXT
);

-- 地支字典
CREATE TABLE IF NOT EXISTS \`dizhis\` (
  \`Id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT NOT NULL,
  \`type\` TEXT,
  \`subType\` TEXT,
  \`fullName\` TEXT,
  \`x\` TEXT,
  \`y\` TEXT,
  \`comment\` TEXT
);

-- 四化类别（生年禄/权/科/忌、自化、对宫等）
CREATE TABLE IF NOT EXISTS \`xiangs\` (
  \`Id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT NOT NULL
);

-- 四化对照表：天干 × 四化类别 → 星曜
CREATE TABLE IF NOT EXISTS \`sihuas\` (
  \`Id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`ganId\` INTEGER,
  \`xiangId\` INTEGER,
  \`starId\` INTEGER,
  \`create_time\` TEXT DEFAULT (datetime('now', 'localtime')),
  \`creator\` TEXT
);

-- 常用查询索引
CREATE TABLE IF NOT EXISTS \`_schema_meta\` (
  \`key\` TEXT PRIMARY KEY,
  \`value\` TEXT
);

CREATE INDEX IF NOT EXISTS \`idx_autolist_name\` ON \`autolist\`(\`name\`);
CREATE INDEX IF NOT EXISTS \`idx_autolist_birthday\` ON \`autolist\`(\`birthday\`);
CREATE INDEX IF NOT EXISTS \`idx_noautolist_name\` ON \`noautolist\`(\`name\`);
CREATE INDEX IF NOT EXISTS \`idx_stars_isDeleted\` ON \`stars\`(\`isDeleted\`);
CREATE INDEX IF NOT EXISTS \`idx_sihuas_gan\` ON \`sihuas\`(\`ganId\`, \`xiangId\`);
`
