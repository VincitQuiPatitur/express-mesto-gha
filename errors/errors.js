const BAD_REQUEST_ERROR = 400; //переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля
const NOT_FOUND_ERROR = 404; //карточка или пользователь не найден
const INTERNAL_SERVER_ERROR = 500; //ошибка по-умолчанию

module.exports = {
    BAD_REQUEST_ERROR,
    NOT_FOUND_ERROR,
    INTERNAL_SERVER_ERROR
};
