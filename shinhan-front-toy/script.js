const showModal = () => {
    let modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.style.animation = 'fadein 2s';
}
const closeModal = () => {
    let modal = document.getElementById('modal');
    modal.style.animation = 'fadeout 2s';
    setTimeout(() => modal.style.display = 'none', 2000);
}