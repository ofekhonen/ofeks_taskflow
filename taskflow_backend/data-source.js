const { DataSource } = require("typeorm"); // מייבא את המחלקה DataSource מ־typeorm (אחראית על חיבור ל־DB)

const AppDataSource = new DataSource({ // יוצר אובייקט חדש שמייצג את החיבור לבסיס הנתונים
  type: "postgres",       // סוג בסיס הנתונים (PostgreSQL)
  host: "localhost",      // השרת של ה־DB (המחשב שלך)
  port: 5432,             // הפורט שבו Postgres עובד
  username: "postgres",   // שם המשתמש שלך ל־Postgres
  password: "ofek290307",       // הסיסמה ל־Postgres (לשנות לפי מה שיש לך)
  database: "taskdb",    // שם בסיס הנתונים

  synchronize: false,     // אומר ל־TypeORM לא ליצור טבלאות אוטומטית (אנחנו עובדים עם migrations)
  logging: false,         // מבטל לוגים מיותרים של SQL

  entities: [__dirname + "/entity/*.js"], // נתיב מלא לקבצי Entity
  migrations: ["migration/*.js"] // נתיב מלא למיגרציות
});

module.exports = AppDataSource; // מייצא את החיבור כדי להשתמש בו בקבצים אחרים