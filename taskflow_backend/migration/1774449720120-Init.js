// מייבא את המחלקה DataSource מ-TypeORM (לא חובה ב-JS פשוט אם יש לך setup אחר)
"use strict";

module.exports = class Init1774449720120 {
    // הפונקציה up מריצה את השינויים בבסיס הנתונים (יצירת טבלאות וכו')
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" SERIAL PRIMARY KEY,      
                "title" varchar NOT NULL,     
                "completed" boolean DEFAULT false, 
                "createdAt" TIMESTAMP DEFAULT now()
            )
        `);
    }

    // הפונקציה down מבטלת את השינויים (משמשת למיגרציה הפוכה)
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "tasks"`); // מוחקת את הטבלה
    }
};