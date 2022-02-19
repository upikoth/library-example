# Пример огранизации библиотеки

- Не ставим запрет пуша в main, так как бот не сможет пушить

## Добавление semantic-release в проект на github

[Ссылка на библиотеку](https://github.com/semantic-release/semantic-release)

Для чего:
- Автоматическое создание тегов с корректной версией ПО
- Коммиты, удовлетворяющие определенному формату
- Автоматическое создание Changelog на основе коммитов

### Устанавливаем semantic-release

- npm install -g semantic-release-cli
- semantic-release-cli setup

### Убираем деплой на npm

- добавляем файл .releaserc.json
```json
{
  "plugins": [
    ["@semantic-release/npm", {
      "npmPublish": false
    }]
  ]
}
```

### Настраиваем ci через github actions

- Добавляем файл .github/workflows/release.yml

```yml
name: Release package
on:
  push:
    branches:
      - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "16.x"
      - run: npm ci
      - run: npm run semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

В результате при каждом пуше в ветку main будет создаваться тег в репозитории github с соответстующей версией приложения.

Для корректной работы библиотеки все коммиты должны быть оформлены в строгом соответствии с [этим документом](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format).

### Добавляем генерацию корректных коммитов

- Устанавливаем необходимые библиотеки

```bash
npm install --save-dev commitizen
npm i cz-conventional-changelog --save-dev
```

- Модифицируем package.json

```json
{
  "scripts": {
    "commit": "cz",
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

Таким образом при запуске npm run commit будет генерироваться корректный коммит

### Добавляем линтер для коммитов

- Устанавливаем нужные пакеты

```bash
npm install --save-dev @commitlint/{cli,config-conventional}
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

npm install husky --save-dev
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

- Еще раз правим package.json

```json
"scripts": {
  "prepare": "husky install"
},
```

### Добавляем changelog файл и корректное формирование тегов

```bash
npm install @semantic-release/changelog -D
npm install @semantic-release/git -D
```

- Модифицируем commitlint.config.ts, чтобы бот мог добавлять коммиты

```ts
rules: {
  'body-max-line-length': [0, 'always', Infinity]
}
```

- Придется убрать защиту от пуша на ветку, чтобы также бот мог пушить
- Изменяем .releaserc.json, указываем файл куда сохранять информацию о тегах и сообщение релизного коммита

### Статические анализаторы кода

- TypeScript
- Eslint


#### TypeScript

#### Eslint

- добавляем библиотеку, конфиг, команду в package.json
- добавляем вызов eslint в pre-commit hook
- добавляем вызов eslint при пуше в репозиторий
- запрещаем мерджить все ветки, которые не прошли eslint (Settings -> Branches -> Require status checks)

### Тестирование

- npm install --save-dev jest
- npm i --save-dev @types/jest
- npm i --save-dev ts-jest
- добавляем скрипт в package.json
- создаем jest.config.ts
- "jest": true в eslintrc.json, чтобы линтер на глобальные переменки не ругался
- добавляем провеку тестами в pre-push hook
- добавляем проверку в ci
