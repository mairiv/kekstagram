'use strict';
(function () {
  var PHOTO_NUMBERS_MAX = 25;

  var COMMENTS_DATA = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var DESCRIPTION_DATA = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var dataPhoto = [];

  var pictureTemplate = document.querySelector('#picture');
  var picturesContainer = document.querySelector('.pictures');
  var bigPicturesContainer = document.querySelector('.big-picture');
  var bigPicturesImage = bigPicturesContainer.querySelector('.big-picture__img img');
  var bigPicturesLikes = bigPicturesContainer.querySelector('.likes-count');
  var bigPicturesCommentsCount = bigPicturesContainer.querySelector('.comments-count');
  var bigPicturesCommentsList = bigPicturesContainer.querySelector('.social__comments');
  var bigPicturesCommentsItem = bigPicturesContainer.querySelector('.social__comment');
  var bigPicturesCommentsCountWrapper = bigPicturesContainer.querySelector('.social__comment-count');
  var bigPicturesCommentsLoad = bigPicturesContainer.querySelector('.social__comment-loadmore');

  // получает случайное число от min до max
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // генерирует url фото
  function getPictureUrl(photoNumber) {
    return 'photos/' + photoNumber + '.jpg';
  }

  // сортирует массив в случайном порядке
  function sortArray(array) {
    var resultIndex = array.length;
    var currentIndex;
    var valueResultIndex;

    while (resultIndex) {
      currentIndex = Math.floor(Math.random() * resultIndex--);
      valueResultIndex = array[resultIndex];
      array[resultIndex] = array[currentIndex];
      array[currentIndex] = valueResultIndex;
    }
  }

  // возвращает один или два комментария из массива
  function getComment(comments) {
    var comment = [];
    var comentsCount = getRandomNumber(1, 2);
    sortArray(comments);
    for (var i = 0; i < comentsCount; i++) {
      comment[i] = comments[i];
    }
    return comment;
  }

  function getDescription(descriptions) {
    return descriptions[getRandomNumber(0, descriptions.length - 1)];
  }

  function DataObject(photoNumber) {
    this.url = getPictureUrl(photoNumber);
    this.likes = getRandomNumber(15, 200);
    this.comments = getComment(COMMENTS_DATA, this.comentsCount);
    this.description = getDescription(DESCRIPTION_DATA);
  }

  function getDataObject() {
    for (var i = 0; i < PHOTO_NUMBERS_MAX; i++) {
      var photoNumber = i + 1;
      dataPhoto[i] = new DataObject(photoNumber);
      dataPhoto[i].id = i;
    }
  }

  // создает и заполняет DOM-элемент
  function createElement(obj) {
    var element = pictureTemplate.content.querySelector('.picture__link').cloneNode(true);
    var image = element.querySelector('img');
    var likes = element.querySelector('.picture__stat--likes');
    var comments = element.querySelector('.picture__stat--comments');

    image.src = obj.url;
    likes.textContent = obj.likes;
    comments.textContent = obj.comments.length;
    element.dataset.id = obj.id;
    return element;
  }

  function addFragment() {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < PHOTO_NUMBERS_MAX; i++) {
      fragment.appendChild(createElement(dataPhoto[i]));
    }
    picturesContainer.appendChild(fragment);
  }

  function showComments(comments) {
    bigPicturesCommentsList.innerHTML = '';

    for (var i = 0; i < comments.length; i++) {
      var commentItem = bigPicturesCommentsItem.cloneNode(true);
      var commentAvatar = commentItem.querySelector('img');
      commentAvatar.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
      commentItem.childNodes[2].textContent = comments[i];
      bigPicturesCommentsList.appendChild(commentItem);
    }
  }

  //  выводит оверлей с большой фототграфией
  function showBigPicture(data) {
    bigPicturesImage.src = data.url;
    bigPicturesLikes.textContent = data.likes;
    bigPicturesCommentsCount.textContent = data.comments.length;
    bigPicturesContainer.classList.remove('hidden');
    showComments(data.comments);
    bigPicturesCommentsCountWrapper.classList.add('visually-hidden');
    bigPicturesCommentsLoad.classList.add('visually-hidden');
  }


  getDataObject();

  addFragment();

  // -------------------- создание обработчиков для вывода большой фотографии
  var ESC_KEYCODE = 27;
  var buttonCloseBigPicture = document.querySelector('.big-picture__cancel');

  // закрытие большого фото по ESC
  function onBigPicturePressEsc(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPicture();
    }
  }

  // закрытие большого фото по клик по кнопке крестик
  function onButtonCloseBigPictureClick() {
    closeBigPicture();
  }

  // открывает большую фотографию по клику на мелкие картинки
  function onPhotosClick(evt) {
    var link = evt.target.closest('.picture__link');
    if (link) {
      showBigPicture(dataPhoto[link.dataset.id]);
      picturesContainer.removeEventListener('click', onPhotosClick);
      window.addEventListener('keydown', onBigPicturePressEsc);
      buttonCloseBigPicture.addEventListener('click', onButtonCloseBigPictureClick);
    }
  }

  function closeBigPicture() {
    bigPicturesContainer.classList.add('hidden');
    bigPicturesCommentsCountWrapper.classList.remove('visually-hidden');
    bigPicturesCommentsLoad.classList.remove('visually-hidden');
    picturesContainer.addEventListener('click', onPhotosClick);
    window.removeEventListener('keydown', onBigPicturePressEsc);
    buttonCloseBigPicture.removeEventListener('click', onButtonCloseBigPictureClick);
  }

  picturesContainer.addEventListener('click', onPhotosClick);

  // --------------------загрузка фото----------------

  var inputUploadFile = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var buttonCloseUploadPhoto = document.querySelector('.img-upload__cancel');

  function onUploadOverlayPressEsc(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeUploadOverlay();
    }
  }

  function onbuttonCloseUploadPhotoClick() {
    closeUploadOverlay();
  }

  function onInputPhotoUpload() {
    uploadOverlay.classList.remove('hidden');
    window.addEventListener('keydown', onUploadOverlayPressEsc);
    buttonCloseUploadPhoto.addEventListener('click', onbuttonCloseUploadPhotoClick);
    scaleEffect.classList.add('hidden');
  }

  function closeUploadOverlay() {
    uploadOverlay.classList.add('hidden');
    inputUploadFile.addEventListener('change', onInputPhotoUpload);
    window.removeEventListener('keydown', onUploadOverlayPressEsc);
    buttonCloseUploadPhoto.removeEventListener('click', onbuttonCloseUploadPhotoClick);
  }

  inputUploadFile.addEventListener('change', onInputPhotoUpload);

  // ----------------------Эффекты фото----------

  var effectsTogglers = document.querySelectorAll('.effects__label');
  var previewPhoto = document.querySelector('.img-upload__preview');
  var inputEffectLevel = document.querySelector('[name="effect-level"]');
  var scaleEffect = document.querySelector('.scale');
  var lineScaleEffect = document.querySelector('.scale__line');
  var pinScaleEffect = document.querySelector('.scale__pin');
  var levelScaleEffect = document.querySelector('.scale__level');

  function EffectsData(className, filterName, filterMin, filterMax, filterPostfix) {
    this.class = className;
    this.filterName = filterName;
    this.filterMin = filterMin;
    this.filterMax = filterMax;
    this.filterPostfix = filterPostfix || '';
  }

  EffectsData.prototype.getFilter = function (inputValue) {
    var filterValue = (this.filterMax - this.filterMin) / 100 * inputValue + this.filterMin;
    return this.filterName + '(' + filterValue + this.filterPostfix + ')';
  };

  var effects = {
    'effect-chrome': new EffectsData('effects__preview--chrome', 'grayscale', 0, 1),
    'effect-sepia': new EffectsData('effects__preview--sepia', 'sepia', 0, 1),
    'effect-marvin': new EffectsData('effects__preview--marvin', 'invert', 0, 100, '%'),
    'effect-phobos': new EffectsData('effects__preview--phobos', 'blur', 0, 3, 'px'),
    'effect-heat': new EffectsData('effects__preview--heat', 'brightness', 1, 3)
  };

  function removeEffects(photo) {
    photo.removeAttribute('style');
    if (photo.className.indexOf('effects') > 0) {
      var classesPhoto = [].filter.call(photo.classList, function (photoClass) {
        return photoClass.indexOf('effects') < 0;
      });
      photo.classList = classesPhoto;
    }
  }

  function updateScaleLevelEffect() {
    levelScaleEffect.style.width = inputEffectLevel.value + '%';
    pinScaleEffect.style.left = inputEffectLevel.value + '%';
  }

  function onEffectsTogglerClick(evt) {
    var toggler = evt.target.closest('.effects__label');
    if (toggler) {
      var effect = toggler.getAttribute('for');

      removeEffects(previewPhoto);
      if (effect === 'effect-none') {
        scaleEffect.classList.add('hidden');
        return;
      }
      if (scaleEffect.classList.contains('hidden')) {
        scaleEffect.classList.remove('hidden');
      }
      previewPhoto.classList.add(effects[effect].class);
      inputEffectLevel.value = 70;
      updateScaleLevelEffect();

      pinScaleEffect.addEventListener('mouseup', function (upEvt) {
        onScalePinEffectMouseUp(effects[effect]);
        upEvt.preventDefault();
      });
    }
  }

  function onScalePinEffectMouseUp(effect) {
    var maxWidth = lineScaleEffect.offsetWidth;
    var currentWidth = levelScaleEffect.offsetWidth;
    inputEffectLevel.value = Math.round(currentWidth / maxWidth * 100);
    updateScaleLevelEffect();
    previewPhoto.style.filter = effect.getFilter(inputEffectLevel.value);
    console.log(effect.getFilter(inputEffectLevel.value));
  }

  effectsTogglers.forEach(function (toggler) {
    toggler.addEventListener('click', onEffectsTogglerClick);
  });
})();