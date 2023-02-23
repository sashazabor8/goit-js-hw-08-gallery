import galleryItems from './exportGallery.js';

const refs = {
    gallery: document.querySelector('.js-gallery'),
    modal: document.querySelector('.js-lightbox'),
    overlay: document.querySelector('.lightbox__overlay'),
    lightboxImage: document.querySelector('.lightbox__image'),
    modalClose: document.querySelector('button[data-action="close-lightbox"]'),
    
    
}



//! Создание разметки 

function createMarkup (gallery) {

    return gallery.map(({preview, original, description})=> {
        return  `
        <li class="gallery__item">
         <a
           class="gallery__link"
           href="${original}"
         >
           <img 
             class="gallery__image"
             src="${preview}"
             data-source="${original}"
             alt="${description}"
             width="392px"
             height="240px"
             loading = "lazy"
           />
         </a>
       </li>`
       }
    ).join('')
    
}


refs.gallery.insertAdjacentHTML('beforeend',createMarkup(galleryItems))

//! убираем дефолтное скачивание файлов со ссылки 

const linksRef = document.querySelectorAll('.gallery__link')

linksRef.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    
  });
});

//! добавление слушателя события и делегирование на сами картинки. 
//! Открытие модалки и добавление src .lightbox__image с data-source

refs.gallery.addEventListener('click', onGalleryClick);

function onGalleryClick (e) {
    if (e.target.className !== 'gallery__image' ) return

    refs.modal.classList.add('is-open')

    refs.lightboxImage.src = e.target.dataset.source;


    refs.lightboxImage.alt = e.target.alt;
}


let counterWithArrows = 0;
let indexCurrentImages = 0;

//! Закрытие модалки и очищение src .lightbox__image

refs.modalClose.addEventListener('click', isCloseModal) 

function isCloseModal ( ) {
    refs.modal.classList.remove('is-open')

    refs.lightboxImage.src = '';

    counterWithArrows = 0;
    indexCurrentImages = 0;
}

//! Закрытие модалки нажатимем на overlay 

refs.overlay.addEventListener('click', isCloseModal) 

//! Закрытие модалки нажатимем на клавишу ESC  

document.body.addEventListener('keydown', closeModalForEsc) 

function closeModalForEsc (e) {
    if (!refs.modal.classList.contains('is-open')) return
    if (e.code !== 'Escape') return

    isCloseModal()
}


//! Добавление переключения изображений чеерез стрелочки 

document.body.addEventListener('keydown', switchImagesWithArrows) 

function switchImagesWithArrows (e) {
    if (!refs.modal.classList.contains('is-open')) return
    if (e.code !== 'ArrowRight' && e.code !== 'ArrowLeft') return

    let indexStartImage = galleryItems.indexOf(galleryItems.find(item => item.original === e.target.href))

    if (e.code === 'ArrowRight') {
      counterWithArrows +=1;
      indexCurrentImages =  indexStartImage +counterWithArrows;
      console.log('counterWithArrows', counterWithArrows);
      console.log('indexCurrentImages', indexCurrentImages);

      if (indexCurrentImages > galleryItems.length - 1) {
        indexCurrentImages = 0;
        counterWithArrows = 0;
      }

      refs.lightboxImage.src= galleryItems[indexCurrentImages].original;
      refs.lightboxImage.alt= galleryItems[indexCurrentImages].description;
    }

    if (e.code === 'ArrowLeft') {
      counterWithArrows -=1;
      indexCurrentImages =  indexStartImage + counterWithArrows;
      console.log('counterWithArrows', counterWithArrows);
      console.log('indexCurrentImages', indexCurrentImages);

      if (indexCurrentImages < 0 ) {
        counterWithArrows = galleryItems.length - 1 ;
        indexCurrentImages = galleryItems.length - 1 ;
      }

      refs.lightboxImage.src= galleryItems[indexCurrentImages].original;
      refs.lightboxImage.alt= galleryItems[indexCurrentImages].description;
    }

}


//! Добавление ленивой загрузки на изображения 


const allImagesRef = document.querySelectorAll('.gallery__image');

allImagesRef.forEach(image => {
  image.addEventListener('load', () => {
    console.log(123);
  }, {once: true})
})





