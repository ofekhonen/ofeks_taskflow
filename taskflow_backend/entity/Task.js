const { EntitySchema } = require("typeorm"); // מייבא כלי שמאפשר להגדיר טבלה דרך אובייקט

module.exports = new EntitySchema({ // מייצא את ההגדרה של הטבלה
  name: "Task",        // שם ה־Entity בתוך הקוד
  tableName: "tasks",  // שם הטבלה בפועל בבסיס הנתונים

  columns: {   
            // כאן מגדירים את כל העמודות בטבלה
    id: {
      primary: true,   // מגדיר שזה המפתח הראשי (Primary Key)
      type: "int",     // סוג הנתון: מספר שלם
      generated: true, // הערך נוצר אוטומטית (auto increment)
    },
    title: {
      type: "varchar", // טקסט
    },
    completed: {
      type: "boolean", // true/false
      default: false,  // ברירת מחדל: false
    },
    createdAt: {
      type: "timestamp", // תאריך + שעה
      createDate: true,  // מתמלא אוטומטית בזמן יצירה
    },
    // 👇 הוספה חדשה
    description: {
      type: "varchar",
      nullable: true, // שלא יקרוס על נתונים קיימים
    },
  },
});