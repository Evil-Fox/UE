# Website layout of UE

Initial stage of development

## Установка 
### Установи пакеты NPM
```sh
npm install 
```
### Установи зависимости 
```sh
bower install 
```

## Запуск через GULP
### Запуск gulp сервера и сборка dev
```sh
gulp start
```
### Собрать production version
Главная версия собираеться в папке `dist`
```sh
gulp build
```

## Зырь сюды!
#### После сборки главной версии нужно в HTML заменить `style.scc` на `style.min.css`
```html
<head>
    <link rel="stylesheet" href="css/style.css">
</head>
```
меняешь на 
```html
<head>
    <link rel="stylesheet" href="css/style.min.css">
</head>
```
