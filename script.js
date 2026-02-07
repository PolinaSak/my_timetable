document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.week-buttons button');
  const lessons = document.querySelectorAll('.lesson');

  function getWeekLabel(lesson) {
      const weekEl = lesson.querySelector('.week');
      return weekEl ? weekEl.textContent.trim().toLowerCase() : 'all';
  }

  // Логика скрытия без "дырок"
  function showWeek(targetWeek) {
      const target = (targetWeek || 'all').toLowerCase();

      lessons.forEach(lesson => {
          const label = getWeekLabel(lesson);
          const match = target === 'all' || label === target || label === 'all';

          if (match) {
              lesson.style.display = 'flex';
          } else {
              lesson.style.display = 'none';
          }
      });
  }

  // Логика окрашивания прошедших пар
  function markPastLessons(activeWeek) {
      const now = new Date();
      const daysMap = {
          "Понедельник": 1, "Вторник": 2, "Среда": 3,
          "Четверг": 4, "Пятница": 5, "Суббота": 6
      };

      lessons.forEach(lesson => {
          const day = lesson.dataset.day;
          const time = lesson.dataset.time;
          if (!day || !time || !daysMap[day]) return;

          const lessonDate = new Date(now);
          // Устанавливаем дату занятия относительно текущей недели
          lessonDate.setDate(now.getDate() - now.getDay() + daysMap[day]);
          const [hours, minutes] = time.split(':').map(Number);
          lessonDate.setHours(hours, minutes, 0, 0);

          // Если неделя выбрана (не null и не 'all' в зависимости от твоих предпочтений)
          // В твоем старом коде было if(activeWeek), значит 'all' тоже красит (голубым)
          if (activeWeek) {
              if (lessonDate < now) {
                  lesson.classList.add('past');
              } else {
                  lesson.classList.remove('past');
              }
          } else {
              lesson.classList.remove('past');
          }
      });
  }

  buttons.forEach(button => {
      button.addEventListener('click', () => {
          const week = button.dataset.week || 'all';
          
          // 1. Скрываем/показываем предметы
          showWeek(week);

          // 2. Управляем активной кнопкой
          buttons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          // 3. МЕНЯЕМ ЦВЕТА (через класс на body)
          document.body.classList.remove('week-1n', 'week-2n', 'week-all');
          if (week === '1н') {
              document.body.classList.add('week-1n');
          } else if (week === '2н') {
              document.body.classList.add('week-2n');
          } else {
              document.body.classList.add('week-all');
          }

          // 4. Запускаем маркировку прошедших пар
          markPastLessons(week);
      });
  });

  // Начальное состояние при загрузке
  showWeek('all');
  document.body.classList.add('week-all');
  markPastLessons(null); // Изначально не красим, пока не нажата кнопка
});