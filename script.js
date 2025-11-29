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
  