<<<<<<< HEAD
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
=======
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.week-buttons button');
    const lessons = document.querySelectorAll('.lesson');
  
    function getWeekLabel(lesson) {
      const weekEl = lesson.querySelector('.week');
      return weekEl ? weekEl.textContent.trim().toLowerCase() : 'all';
    }
  
    function getTimeLabel(lesson) {
      const timeEl = lesson.querySelector('.time');
      return timeEl ? (timeEl.childNodes[0].textContent || '').trim() : '';
    }
  
    function showWeek(targetWeek) {
      const target = (targetWeek || 'all').toLowerCase();
  
      const timeGroups = {};
      lessons.forEach(lesson => {
        const time = getTimeLabel(lesson);
        if (!timeGroups[time]) timeGroups[time] = [];
        timeGroups[time].push(lesson);
      });
  
      Object.values(timeGroups).forEach(group => {
        const weekLabels = group.map(getWeekLabel);
        const hasConflict = weekLabels.includes('1н') && weekLabels.includes('2н');
  
        group.forEach(lesson => {
          const label = getWeekLabel(lesson);
          const details = lesson.querySelector('.details');
          const match = target === 'all' || label === target || label === 'all';
  
          if (hasConflict) {
            lesson.style.display = match ? 'flex' : 'none';
          } else {
            lesson.style.display = 'flex';
            if (details) {
              if (match) {
                details.style.visibility = 'visible';
                details.style.height = 'auto';
                details.style.overflow = 'visible';
              } else {
                details.style.visibility = 'hidden';
                details.style.height = '0';
                details.style.overflow = 'hidden';
              }
            }
          }
        });
      });
    }
  
    function markPastLessons(activeWeek) {
      const now = new Date();
      const daysMap = {
        "Понедельник": 1,
        "Вторник": 2,
        "Среда": 3,
        "Четверг": 4,
        "Пятница": 5,
        "Суббота": 6
      };
  
      lessons.forEach(lesson => {
        const day = lesson.dataset.day;
        const time = lesson.dataset.time;
        if (!day || !time || !daysMap[day]) return;
  
        const lessonDate = new Date(now);
        lessonDate.setDate(now.getDate() - now.getDay() + daysMap[day]);
        const [hours, minutes] = time.split(':').map(Number);
        lessonDate.setHours(hours, minutes, 0, 0);
  
        if (activeWeek) {
          if (lessonDate < now) {
            lesson.classList.add('past');
          } else {
            lesson.classList.remove('past');
          }
        } else {
          // если неделя не выбрана — не закрашиваем
          lesson.classList.remove('past');
        }
      });
    }
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const week = button.dataset.week || 'all';
        showWeek(week);
  
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
  
        document.body.classList.remove('week-1n', 'week-2n', 'week-all');
        if (week === '1н') {
          document.body.classList.add('week-1n');
        } else if (week === '2н') {
          document.body.classList.add('week-2n');
        } else {
          document.body.classList.add('week-all');
        }
  
        // теперь прошедшие пары окрашиваются только при выбранной неделе
        markPastLessons(week);
      });
    });
  
    // начальное состояние: показываем все, но НЕ окрашиваем прошедшие пары
    showWeek('all');
    document.body.classList.add('week-all');
    markPastLessons(null); // null → не закрашивать
  });
  
>>>>>>> bc59743c51d6a1838548254dacfabe6d1e840a0a
