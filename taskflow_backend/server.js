// 1️ ייבוא Express
const express = require('express');

// 2️⃣ יצירת אפליקציה (השרת שלנו)
const app = express();

const cors = require("cors");
app.use(cors()); // מאפשר לכל הדומיינים לגשת ל-backend

// 3️⃣ Middleware – מאפשר לשרת לקרוא JSON בבקשות POST/PUT
app.use(express.json());

// 4️⃣ Logger Middleware – מדפיס כל בקשה שמגיעה לטרמינל
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // ממשיך ל-route הבא
});

// 5️⃣ חיבור ל-Postgres באמצעות TypeORM
const AppDataSource = require("./data-source.js"); // מייבא את ההגדרות של TypeORM שמגדירות איך להתחבר ל־ Postgres
const Task = require("./entity/Task.js");             // מייבא את Entity של המשימות

// התחלת החיבור ל-DB
AppDataSource.initialize()    // פותח את החיבור ל postgres ומטעין את כל ה entity                    
  .then(() => console.log("Data Source has been initialized!")) // הודעה שהחיבור הצליח
  .catch((err) => console.error("Error during Data Source initialization", err)); // טיפול בשגיאה אם החיבור נכשל

// מקבלים Repository של Task
// respository הוא כמו אמצעי תקשורת בין הקוד שלי לבין ה database
// Repository מאפשר לבצע CRUD על הטבלה מבלי לכתוב SQL ישיר
const taskRepo = AppDataSource.getRepository(Task); // לוקח את ה entity ומייצר respository שמאפשר crud בלי לכתוב SQL 


// פונקציה ליצירת שגיאות מותאמות אישית
function createError(message, status) {
  const error = new Error(message); // יוצר אובייקט שגיאה עם ההודעה שהעברנו
  error.status = status;            // מוסיף ל-error את סטטוס הקוד הרצוי (404, 400, וכו')
  return error;                     // מחזיר את האובייקט לשימוש ברוטים
}



//routes CRUD

//GET

app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await taskRepo.find(); // מחפש את כל השורות של הטבלה tasks ב־DB ומחזיר מערך של אובייקטים.
    res.json(tasks);
  } catch (err) {
    next(err); // שולח ל-error middleware במקרה של שגיאה
  }
});


//POST

// POST - יצירת משימה חדשה
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    if (!title) throw createError('Title is required', 400); // בדיקה שהכותרת קיימת

    // create + save משולבים: יוצרים אובייקט חדש ושומרים אותו ב-DB
    const task = taskRepo.create({
      title,
      description: description || "", // השדה החדש description במידה ואין מכניס כברירת מחדל מחרוזת ריקה 
      completed: completed || false
    });

    await taskRepo.save(task); // שומר ב-DB
    res.status(201).json(task); // מחזיר את האובייקט שנשמר
  } catch (err) {
    next(err);
  }
});

  // PUT - עדכון משימה
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const task = await taskRepo.findOneBy({ id }); // מחפש את המשימה לפי id
    if (!task) throw createError(`Task with id ${id} not found`, 404);

    taskRepo.merge(task, req.body); // מחליף את השדות הקיימים בערכים החדשים
    await taskRepo.save(task);       // שומר את השינויים ב-DB
    res.json(task);
  } catch (err) {
    next(err);
  }
});


  // DELETE - מחיקת משימה
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await taskRepo.delete(id); // מוחק את השורה לפי id
    if (result.affected === 0) throw createError(`Cannot delete task. Task id ${id} not found`, 404);

    res.json({ deleted: id }); // מחזיר מידע על המשימה שנמחקה
  } catch (err) {
    next(err);
  }
});

  


  //error handling

  app.use((err, req, res, next) => {
    console.error(err.stack);               // 1️⃣ מדפיס את כל השגיאה בטרמינל
    res.status(err.status || 500).json({   // שולח ללקוח JSON עם סטטוס השגיאה או 500 אם לא מוגדר
      message: err.message,               // 3️⃣ הודעה קצרה שמסבירה את השגיאה
      stack: err.stack                   // 4️⃣ פירוט מלא של השגיאה (לדיבוג)
    });
  });


  //START THE SERVER

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });