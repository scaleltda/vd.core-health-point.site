document.addEventListener('DOMContentLoaded', () => {
    const allInteractiveBtns = document.querySelectorAll('.action-btn, .c-btn');

    allInteractiveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'like-btn') {
                const dislike = document.getElementById('dislike-btn');
                if (dislike) dislike.classList.remove('liked');
            } else if (btn.id === 'dislike-btn') {
                const like = document.getElementById('like-btn');
                if (like) like.classList.remove('liked');
            }
            btn.classList.toggle('liked');
        });
    });
});
