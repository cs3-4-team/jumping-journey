import { CanvasHelper } from '@/shared/canvas/CanvasHelper';
import { Lava } from '../lava';
import { Coin } from '../coin';
import { Ground } from '../ground';
import { Matrix } from '@/shared/matrix'; // Путь к файлу с классом Matrix

// Создаем объект CanvasHelper
const canvasHelper = new CanvasHelper('gameCanvas');

// Типы для карты (земля, лава, монета)
const CellType = {
  GROUND: 0,
  LAVA: 1,
  COIN: 2
};

// Создаем карту с использованием Matrix
const mapDataMatrix = new Matrix(Uint8Array, 11, 21); // Примерная размерность карты 11x21

// Заполнение карты данными (можно заменить на реальные данные)
const mapData = [
  '........L.........L....',
  '..L....................',
  '......L.......L........',
  '.............L.........',
  '...L....L..........L...',
  '......$.............$..',
  'L..............L.......',
  '.............L.........',
  '.....L.................',
  '...............L.....L.',
  'LLLLLLLLLLLLLLLLLLLLLLL'
];

// Переводим символы карты в типы клеток и сохраняем в Matrix
mapData.forEach((row, y) => {
  row.split('').forEach((symbol, x) => {
    let cellType;

    if (symbol === 'L') {
      cellType = CellType.LAVA;
    } else if (symbol === '$') {
      cellType = CellType.COIN;
    } else {
      cellType = CellType.GROUND;
    }

    mapDataMatrix.set(y, x, cellType);
  });
});

function drawMap() {
  // Размеры клеток
  const cellWidth = 10;
  const cellHeight = 10;

  // Счетчики типов клеток
  let lavaCount = 0;
  let coinCount = 0;
  let groundCount = 0;

  // Проходим по каждой клетке в матрице
  for (let y = 0; y < mapDataMatrix.dimension[0]; y++) {
    for (let x = 0; x < mapDataMatrix.dimension[1]; x++) {
      const cellType = mapDataMatrix.get(y, x);
      let cell;

      if (cellType === CellType.LAVA) {
        // Создаем объект лавы
        cell = new Lava(x * cellWidth, y * cellHeight, cellWidth, cellHeight, canvasHelper);
        lavaCount++;
      } else if (cellType === CellType.COIN) {
        // Создаем объект монеты
        cell = new Coin(x * cellWidth, y * cellHeight);
        coinCount++;
      } else if (cellType === CellType.GROUND) {
        // Создаем объект земли
        cell = new Ground(x * cellWidth, y * cellHeight);
        groundCount++;
      }

      // Рисуем клетку, если она существует
      if (cell) cell.draw(canvasHelper);
    }
  }

  // Логируем количество созданных клеток
  console.log(`Lava Count: ${lavaCount}`);
  console.log(`Coin Count: ${coinCount}`);
  console.log(`Ground Count: ${groundCount}`);
}

// Рисуем карту

//drawMap();

export { drawMap, mapData };
