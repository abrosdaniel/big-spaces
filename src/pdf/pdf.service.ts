import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class PdfService {
  async generatePdf(data: any) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Здесь будет ваш HTML шаблон с подстановкой данных
    const html = `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>BIG SPACES</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      a {
        text-decoration: none;
      }
      body {
        height: 100vh;
        width: 100vw;
      }

      main {
        width: 100%;
        padding: 50px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 40px;
      }
      #header {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
      }
      #header #left {
        font-size: 9px;
        color: black;
        font-weight: 700;
        display: flex;
        flex-direction: column;
      }
      #header #right {
        font-size: 13px;
        font-weight: 400;
        color: #8e8e8e;
        text-transform: uppercase;
      }

      #title {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        text-transform: uppercase;
      }
      #title h1 {
        font-size: 22px;
      }
      #title h2 {
        font-size: 22px;
        font-weight: 400;
      }

      table {
        /* counter-reset: rowNumber; */
        border-collapse: collapse;
      }
      table tr {
        counter-increment: rowNumber;
      }
      table tr th,
      table tr td {
        border-bottom: 1px solid #e2e2e2;
      }
      table tr th {
        font-size: 9px;
        font-weight: 700;
        padding-bottom: 13px;
      }
      table tr td {
        padding-top: 17px;
        padding-bottom: 17px;
        vertical-align: top;
      }
      table tbody tr td #work {
        display: flex;
        flex-direction: column;
        gap: 3px;
        position: relative;
        margin-left: 25px;
      }
      table tbody tr td #work::before {
        content: counter(rowNumber, decimal-leading-zero);
        position: absolute;
        top: 0;
        left: -25px;
        font-size: 13px;
        font-weight: 200;
        color: #8e8e8e;
      }
      table tbody tr td #work h4 {
        font-size: 13px;
        font-weight: 600;
      }
      table tbody tr td #work p {
        font-size: 9px;
        font-weight: 300;
        color: #8e8e8e;
      }
      table tbody tr #data {
        font-size: 9px;
        font-weight: 700;
        text-align: end;
      }
      table tbody tr #sum {
        font-size: 13px;
        font-weight: 200;
        text-align: end;
      }
      table tfoot tr td {
        border: none;
        font-size: 22px;
        font-weight: 700;
        text-align: end;
      }

      #desc {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
      }
      #desc #left {
        display: flex;
        flex-direction: row;
        gap: 30px;
      }
      #desc #left #text {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      #desc #left #text h4 {
        font-size: 9px;
        font-weight: 700;
      }
      #desc #left #text p {
        font-size: 13px;
        font-weight: 500;
      }
      #desc #left #text p span {
        font-weight: 700;
      }
      #desc #right {
        font-size: 9px;
        font-weight: 300;
        color: #8e8e8e;
      }

      footer {
        background-color: black;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 39px 50px;
      }
      footer #menu {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 40px;
      }
      footer #phone {
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        font-style: italic;
        color: white;
        margin-right: 20px;
      }
      footer #whatsapp {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        font-size: 9px;
        font-weight: 700;
        text-decoration: none;
        color: white;
      }
      footer #telegram {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        font-size: 9px;
        font-weight: 700;
        text-decoration: none;
        color: white;
      }
    </style>
  </head>
  <body>
    <main>
      <div id="header">
        <div id="left">
          <p>Предварительное предложение от ${new Date().toLocaleDateString('ru-RU')}</p>
          <p>действует 14 дней</p>
        </div>
        <h3 id="right">Больше, чем просто стройка</h3>
      </div>
      <div id="title">
        <h1>Строительство<br />здания под ключ</h1>
        <h2>
          ${data.parameters.length} × ${data.parameters.width} ×
          ${data.parameters.height} М, ${data.parameters.floors} ЭТАЖ(А)
        </h2>
      </div>
      <table>
        <thead>
          <tr>
            <th style="padding-left: 25px; text-align: start">
              Наименование работ
            </th>
            <th style="text-align: end">Объем</th>
            <th style="text-align: end">Стоимость</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div id="work">
                <h4>Проектирование</h4>
                <p>разделы АР, КМ, КМД</p>
              </div>
            </td>
            <td id="data">3 раздела</td>
            <td id="sum">${data.project} р.</td>
          </tr>
          <tr>
            <td>
              <div id="work">
                <h4>Фундамент</h4>
                <p>монолитная плита толщиной ${data.foundation.depth} м</p>
              </div>
            </td>
            <td id="data">${data.foundation.volume} м3</td>
            <td id="sum">${data.foundation.sum} р.</td>
          </tr>
          <tr>
            <td>
              <div id="work">
                <h4>Металлоконструкции</h4>
                <p>
                  каркас из двутавра 25Ш1, профиль 100×100×4 мм и 60×60×4 мм
                </p>
              </div>
            </td>
            <td id="data">${data.metal.volume} т</td>
            <td id="sum">${data.metal.sum} р.</td>
          </tr>
          <tr>
            <td>
              <div id="work">
                <h4>Стеновые сэндвич-панели</h4>
                <p>толщина ${data.wall.depth} мм, сталь 0,45 мм</p>
              </div>
            </td>
            <td id="data">${data.wall.area} м2</td>
            <td id="sum">${data.wall.sum} р.</td>
          </tr>
          <tr>
            <td>
              <div id="work">
                <h4>Кровельные сэндвич-панели</h4>
                <p>толщина ${data.roof.depth} мм, сталь 0,45 мм</p>
              </div>
            </td>
            <td id="data">${data.roof.area} м2</td>
            <td id="sum">${data.roof.sum} р.</td>
          </tr>
          <tr>
            <td>
              <div id="work">
                <h4>Ворота</h4>
                <p>подъемные ${data.gate.size} м</p>
              </div>
            </td>
            <td id="data">${data.gate.count} шт</td>
            <td id="sum">${data.gate.sum} р.</td>
          </tr>
          <tr>
            <td>
              <div id="work">
                <h4>Окна</h4>
                <p>металлопластиковые ${data.window.size} м</p>
              </div>
            </td>
            <td id="data">${data.window.count} шт</td>
            <td id="sum">${data.window.sum} р.</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td colspan="2">${data.sum} р.</td>
          </tr>
        </tfoot>
      </table>
      <div id="desc">
        <div id="left">
          <div id="text">
            <h4>Оплата</h4>
            <p>
              По этапам работ<br />за наличный расчет /<br />+ 7% ИП или 20% ООО
            </p>
          </div>
          <div id="text">
            <h4>Сроки</h4>
            <p>
              Реализация: <span>3-6 мес</span><br />Гарантия: <span>2 года</span
              ><br />на конструкцию и работы
            </p>
          </div>
        </div>
        <p id="right">
          Мы заранее продумываем<br />каждый шаг, чтобы вы не<br />столкнулись
          со скрытыми и<br />непредвиденными расходами
        </p>
      </div>
    </main>
    <footer>
      <svg
        width="167"
        height="22"
        viewBox="0 0 167 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <mask
          id="mask0_2379_169"
          style="mask-type: alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="167"
          height="22"
        >
          <rect width="167" height="22" fill="url(#pattern0_2379_169)" />
        </mask>
        <g mask="url(#mask0_2379_169)">
          <rect width="167" height="22" fill="url(#pattern1_2379_169)" />
          <rect width="167" height="22" fill="white" />
        </g>
        <defs>
          <pattern
            id="pattern0_2379_169"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              xlink:href="#image0_2379_169"
              transform="matrix(0.00137741 0 0 0.0104558 0 -0.00710619)"
            />
          </pattern>
          <pattern
            id="pattern1_2379_169"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              xlink:href="#image0_2379_169"
              transform="matrix(0.00137741 0 0 0.0104558 0 -0.00710619)"
            />
          </pattern>
          <image
            id="image0_2379_169"
            width="726"
            height="97"
            preserveAspectRatio="none"
            xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtYAAABhCAYAAADyQOYiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACh4SURBVHgB7Z1bWhRJ08cDXrkeRl+vbVcwuIK3WIGwgsEViCuwXYG4ApgVgCuwXIHMCmyvPQxzjTJf/CFqvha6K6OqIqvy9HuefhrthO6uyoyIjIwDUaFQKBQKhUKhUBjMBhUKE7HN3Lt3b+fq6mpnc3PzEf/XDI+NjY3tf/75Z7bu9/i1Cx6z4B8v+OcF//yJn89//PhxfnFxsaBCdPBUmP3nP//BPGju/S/8vL1qLN/vC376m+fN9Tzg31lcXl4u+N5fUKFQGBWs3a2trQrrlh+PeE1Chs94fW5Dlq/6HchwXrfX8pv/iXX7Z5HhBS2h64sNGDf4nBQfF7EpUkwGMiQ2AdQY0vzjU35U/NghY8TQPufntyyk6yKkwwPrgIXbHt+n3/i5attEdeScHwsWoO/5755/+fKlpsAJSf7mvFa096HIE6KHDx/usGyteI095bW7s8547osY2zU/3vP7nMWg5yO2owYxxnqIUV9s/Pe//634+R1FyrL3kh8wqHCRFp8/fz6nwOBr/Q8ZwhMh+BOHJWP6pQ8hrKDm9/0jFgGdKiJn/sf3/8BQMLYC2cBPZ/x4+/Xr1zMKkAcPHpzyNdmjgFjlTYSMxb+/f/9+nuI64vvwEV5W1zi+BvuhziWfsBjfYTn+dMz1u8QZZHjI1/3+/fuHvGZeU17UbIPskgdi1xfRG9brEIO7DslzmZNhLQb1c77+hxMY03dovCA8F14Vr9N4sMFywPf/d7o5oZiMUO+/1qALDDgtan68jeFUwIXM0WPl8Bf8nY8oE/jawFP4nCZev0DW8Cs2ek4oMELcIPuGv+8bdmAekiGp6ItkDesVTL7rzcGwltinl9hpUqDwPDgpBrZfICD56WWIRmMo9x9rhTefHyliQjZ2NIi8eqedp5g7/F2fUcKE5hS5TYhzjnX7B/IQ2hgylqc3qemLTcoH7LxP4SGSm1gwBMKYhctLVlIfQjaqAT4fDBp8XiqYgiNjvq4wVI5D9cTK/f8w9f1H8g1FjiSqHccqV8UJMNOOR4wnJQzuIWQ4/zgP0agGzZzj9XtqnbfUB4mvzsqoBgi5pYGkqi9y8lj/BHa9vAvZHdNrlarHGseF/HQcqiBuY4p5kCr3799/zsI2qmPyKe8/r5sjOWZPhphOg/rqvu/fv/+aWpy5XAsYDhVFRAje60xtqAu2P36lAaSsL+5RpmB3JF7LOU+QV1ToDHbq7N04jjm2rMyD4cjR8SkNVMpNIvJS0tzfUippeQw2b7803o2hCbFy/+GNeDV27Cyy3Ckx4N1hmVDxlAh+s8pzB7KLurK1tTWjmzjz6JG1C4PaLFa2WcOyjl1reJC3V/4GvNePJpTfFeVH7/mfg77I1rBeYs4XaY+9EPvFa6kHRzisQE8jTLxaB+ZBxfPgWZkHepoYVbqpQd4JCMWrq6u3KHV0eXnZO8F4qfJMxY//UXeBDUH7mu//L2MqZxHylBqQCZgTIRvXcqw7ox6g7j4lYFhLjD8MnN6GbVNJgZ//5OtS88+d6wPf6mfQlGLtCuT3jsjvUU8T+Lv/luI6dvCeepCLvsg2FOQ2YxwJpxIKEuMRjpYSGqKna+IXEC/DG1aAJ76usXyuivolw4xS9UHKl31oG8PX6gzXijyxfG14zm9LswUojUfSpGmQd0fW0pPQwiZcSaNSC3+27nUf1RDG5sGDB6i8cNTn/oox/Qf/7pmPqjByErrXszrEOcuW3THnHF/LvxzXEZuwF5QQfcpu5qQvimG9hG+jKgXDWjw9c0oYzAM2MvZDrIUeCj2qKSxoglhIif9/3VFg7vouI6cp8RZCzWQDbyKMr30KCL72x20J1nzdUfXjdYux5K1+7xiwDEe95c4bAwnveMNz4WQsw7Vn7PdoxrWysg/CBuaUMbnpi5yqgjiR+JlTyfIt3CIHoxpgHvDCfocOY1RYCa+TLlncr+C5nCLBCIYpPx7jM3T4tTFkgHNuWWTdDwXGCZTGt2/fjmBMssHyGGVLO/yJPZYbwXh3ZUNzsO51KHTMUzTIafkzUcoFzGnUW6aORrUY1M+wjjAPxvQGY+5h3uH9xdjSgDDFUZq1KCv71JQ5uemLYljfZUeSOQpL5GJUL4Gj8HchlHMKDZkLlWucdOp7Am/N1OEA+AxiFC4Uw7d9K2ZWMv9zDLkI8cQEp3mseA74x90Ohs7LgJwVLtl+rVDZK9t27fF1HlFEiGf1XZdEcwn5mMzIWQbvj9NkUsa2Y/M00oaucg1A2ARlTI76ohjWqzmUI6gCZWlUN2xLEtaMCtfItZgrhp5LWFUwSgVGIT6TRliKYq7IHy5PV9DKGJ5E7bVkEE4yudcacqzNa9Z4q+Wfn6gFlgtPKBKWEsa6eNpxf4MwchqwfvnzPOF7qD0xee1bjysq+5yHcv2mIFd9UQzr9RSvNWVtVF/ThAdR4Ro01HCNEc9DkAmgS8JSo+y8yAClsu+VdT8mXRQP83xKr7VSwf97/Ov6TrFUQ+qTMEY3McHBJnDzSc6B1rhGSUXyCBJ8HUM+Ucbkqi+KYb2eKnevNap/UMZG9RI7kvCTNVDSG46umksJwMF6aSAs+XNqYugqH8aglGtzUVME4FrynHimGDqp1xoxnm2v3/JWX5f2cowPvga5VNfokjCGNbsbQ6IdjGtSrBF8d/QoIA+gso+iqkpNmZKzviiGdQsbETc+GYosijlNhCg2HAvVyw+XwvNI9uFBGu8DE0XXPSRhkULp+TAGFfHVUcVlIixEmdA4SZdJabVetY1BFaDlf7OyP3eMryhwJKZ6phnblEb0XQ3HEvSemPK0RJm4mG18dc76wrxBDHtjDvmC/k2G8OJBlYZtxDMNra3a8X1RR3Py2MCxWfJ0jHWdr5sMsLJ6ry38Lg1qZvwjNj//G+NoVo4VH1O+VI7X66mTnDoCL0TlGOM0grvimqswFmKLy2SjbM5K5XfHsG1sTsc03iQEpFXBow07f6afDCDIIDbIL9bJQOgkyMlQ75OcsKliqmOt3Y9rz98TpyWucsHNacmcbHHKhpg2Kh6oHK8nqy98GNZnbN17jSsSowoGNjwgXRIyOr8VSq7lVs9YqqLMyD813dSqrKkjkuSAxxn+jfqTMh8q8kRzrJhjTVLx1s8cw7qUKJocKD3+XjW1z5nK0oASz1mrzOJ59idFhhiiZ4pTPnz3mkYCXjPXRoaNytXd025Ox9beq1Bbm0tejNYhdB76UXwbyjUMzMMaeX64bI+aMiV3fRFlKAiMKux0kCHM/0QJnpo8wbv5ijJCjk19e+lruonlM2vEgfqT0rShSxmwPkyahDUhVduLuOYxemfQItc1RrpymSCtdF3UFCHKLpEVjYQmxpNajqLRprvtF5Wx8qPSoQrDctJYlEb1EhoDbdsylC/VDbIhVduLqeuL6GOsmwLy5Gn3E0v2twUiLLxVQ5GQjxeWBvVt8Hd7FHjvQhClwybAdexZU4TghM01xlgGVIoxUZ6QSax1q5GmKE9mhpSYW4sYlifrXnflc2xubgZlWDchfJqxMSSNaRFdUrvGWeZMaTbILFtqypes9UUyyYs4nucv/YKMQSwdZQILi+e+NhKNIOf7dEQjgPkg3bp8KI7svNaKslLOnXyISMZ36xwxrgCRVOLibVh+tH72JjaZPCMdFmeOYa2JU7FVBkEIn0Z+xxpT7cDpSJGcKRM0pxUhdE6ditz1RVJVQbSZmx2JqsNWX7ocIXZlSZCPajAsdeuyBl7rA8oIVyJr5EqkbnvRcrOpUDjnMXsRXeETwi/kEWXC4sKVOIVEamonGI+1hDmoTtJYJu4nZlSrTkvIsGNmrJ1TxyJ3fZFiuT3TEICxKmNMjbI0Tmem9o7AmIfnmux5Spmg6TzJRsiC4qU12drKsNbUveW5GrUy1uQ3bG1t/Uoe0SQs3i6vtwqFzDIz1IbSoRHKq4uAutsZo4l/tXK0RN051SdFXyRoWOMY1dPxf7Iok3w6E8qRIzxT/Fk0iVVd8NI8JFZi9rLy3B/ls0t5SBfBd1xsg7+j81qidCp5Ap5bRVOKE6030RUOEkJrc1er9gYpKzinROHNUq0YM/iUAXJfcb2jXse+SV1fJGdY44ZN2EQkSnx5q9GRLZQjR9TZtd5w5RIOwt9zRgkzoryoXANY8Wfr6bLA5bmFDFhXXm8VV1dXrQbS1MntcIrwd3KGgIiTI6ryZl1RhO6Y5EwpqwTVlClFXyTaeVEZ56f9W0l7v315q5lXIZXTkQ2XudeaMoBPgRauMcV770ZRESPruMyhaDy3kAFdNvuhJzBK2Itm7UXR4W4ImsQyMsiZUtSvjjoBeShFX5SW5hqSNqwta/Q2SI3KOQUGL/gj442SeVe+iPGakJYIleP1LJQxr8OPZIwm+bqPXFKU3KtoIjo4Rc4i63DXG9f9MsqZcsn9qBOQRyJpfWHeeTEQzCZ16kXepVuhNUEeOUoLXHitrUJfrpOX+M967TQ6NfAE8XVrHSNJQScUIThC3traWpvgenV1NVieIHHRNSYFWaM8av+bjFGGs3WWS5gbfLS99vUpW5trQ/h4I2NehjZUsHnSeJQHvgeSkNuGJK0PXBR9cXWRqmFtdszAFylZL5J4eayFUB24d6QmwyY4MQuILsAT1GY08euoEXtCESJH5CfkEY1nM4WGEgiNcBgdF9ZGqNSsPqD2z3XSRy5Jq/aLNk/nFK3Ntd5qfO/UQ0BuYb5pW0ZT2Ycyjq9uyF1fJGlY800zK4GUcjKRj+Q7Xkx/UMAg7tulKLsQWvc1X2CD6Yhf3ZnKcxcDmo6DP378iF7WKJL5fHxHV83qiyGJexJesHadS7OQUe8dy509zbjUExZvw/fqhJ8W614fGgqorOyTfZ5E7voiOcNaguIrMkBi8lJeJKa1mDVNFwLhraLAvwoWIJQDfG/fO1oCN63e51S4g+t4Gmsnds+i5gTMOtwFCYv8NKP293wz5NoiGb7t/k2xudaE8GXorVa3Nx9A5RoQUtL+VOSuL5IzrHlHqdrJa/BQRSIYfISBxHK92Pg/oEInEKbABoRrGFq9Z6fMXchmf1SDcwo0idCW4S7ahEVe761jXKBpjxxdr3t91MogfOK2pynzl5u3egwUJ081FbLXF0lVBREFZhY/+/379zNKFFaC5l6WlK9X7ki3ttoxbJvn1btSeu9n2DOjWWs1RU6b8dlgGe7Cc+21YtjgxD1F3dqxPdaak8a3ZYPrhartxdSLHWjJXV8kZVizAlN1oNKQwTFaRbacF0GeNuyFcLYMxvpjYflB09Y2FyQG10XUIWdyvyvHsNpKRkjCYuvppCQsDt7sKzYDo7U2l65/B65x+O5UMAVdPV1jUkhAtiJnfZGMYc2THt6LQzIghy5VVjHGS3+vtHBNHBaUJ5rkHxGW74pxfYNmrcXeUEJT+s0qsVnmldeExWU0jUfGam2uCXWU8JdyemiMZoO8ubm5oMI1OeuL6A1r7CL58YGMjGoh+S5VZHx8yQuoCPLEkQxu1dF6IyzhWaSCa61F3VBCW/qNDd2aDOCTyeeKDoumMlzReGRG46AJA6mpYI5ig1w6py6Rs76I0rDGcdj9+/cP2aB+x//Ew9JIfJV6lypNs4qu5NzCNSdkbdSasRCW/DhmYXmcq/dajM5Z2xgkx1HEKL3VJqF1Mo8OHe+Fak5HZAiqHDheHyuBsXIN4PkWdMnTWJmolGTU5KovzKuC4EiMDd7HZEQzmVFsnB+P0GhB2d2rz3v9wTvOOSWOshZnF6L2uBW6wZuoZ/AuaL108GaiZjoLzBMcz+cUi69JEo454YkdHM+V3mqTsAzMO9cY1hH7ZIx09Fv7uu9uf0BifFsTvSQMpKaCKZrKPkwJh1xBjvrC3LDmi3JKhrCgWP7bP/3bEjGqDygDPCiBYlRnBAQd65l9EZbqjO5lgcnGz5tMjk0rxZgor4N44+eucVbeaklYnJHjvXz0HlA0CvNuWJNuLtVUMCeXyj4+yFFfJFUVpC+ov5yLUQ2sPf6lxFB+oJwSexN2+3Qyg8Dk3/uA3AiEdD18+HAMo2QSNB0XY2woAaNaoyitEsGVCYveks41oW4jzGNNwrmzEkOhF5VrQAmHXE9u+iLJluZa5CY/Y8WWVeKdZct3AIVGheyAsGSD50mXY75b7KBrHU6h2CuxoBuPz1skuaUSWsTfbacthIAi9HIhR4Pv+anmng/tetiAOG5FwuIbX8fGmI+s0BdtTokRWptXrgFWCaKFn0EMvWMdl3BIBznpi2wNawhh3mHOy2IYTjGs80WO+Xb5yO6YBtRGF0F7gAf/LcST1ijPJkJzQRECA9Tl0Y3ttAcx1azctImBtUUSoVzHg7YxEltsmrB4Gzacz9sMAp+tzTU1lKkYdz6pHK/v8MbrI0UManDzGnpGHslFX2RnWEsSyrPPnz/XlCmYlJax6vz3RhHmSCBRxrqNTozH+VaIINvFMR3PhZdd4uhaqPjvVBCasXqzNYmLsTSUEMMOoRiVZryEZZgoaXjHXWNwzEz++dT2oq+kegBvuKtFdOzVZUJFcgmcMs3n/R8Dnl9/0wjkoC+yM6xlp/Ou2eGkXlpvFSyktx3HWp0Yy7De2tra43t2TIEhNW7NKuHEyrdv345YCZ2xITTXtLfWssI7ccbz4G0E3uyoG0osbWTVBjWQ5iy7FveG7zXee0bt7zdKl1wkMDocEqZNt5ZRht2UXBcPaDbIKYATGRqRlPVFzsmLldRM/AjhnVOdXaMd4r9cXl7+RYUC3XgjeLN68P3798dWnfZWsIe1y0ITazfYpgKxNZSAIY3EIOkRcMoKD0fbKG9XUTeeWdWs5jl02DZmzC65LOc0rc1NZWuDJgmWSh1lX1SUAYrKN+akqi825IjPWRs0dSRO2GtzGL7WprUCv3z50svtbP05eFHMeIF8Is+w0j8I1WPNBlL2HutVSPUIbGKfk8eSZLJ+65DqnrrWGT4zK7NRjMKWz3DdH0BKcA66P/BU89/ZtwqLQqMIRWz1s7FOHcWD/5fj8+z7aCeO+F1XqAHL4V9LjLU90oiuorS54HX7K01MKvqiGNZ3qVHQ3MfFLob1MIphHTciNOGBfNozK1wLwrze+DBwtOQmV8VzvI/MfzJAalYfu96T7/Go605h4L6w7voIFDI7CMMoRXgu/mV9yhsgSDQeI09BTcz6otSxvkuFcjAp19YtFKZAjv0OYQzxZuwJhJmnijLweJzC0zTVOpbSa1nA9/CMjeonVka14GyTPlLC4k+44lB9tDZXhimWMBAPaCr7pECI8flT6AurkOCs61ivQ6pmQCnvZtIdrlAYFTHC4I04hDDb3Nzc48dTsj1yrdBYYIrWuIr46uhp+gBYnwyElLB4GzFA9lpeN99Q3bt3b6YYNkpFh9xQJi6e9Wl8EhJsuE52uqdhLH2BOGwLfVEM6/Vsw7hGQfNY6+gWCjEg6wvH50dNjB3/fC00LbxFiNPF32SB+WqseFzPR5eTIrHUb1j5HFnH9IrHaE7t7z9awuJtEPblqAxibljz+zmrOEllooI9zg0yG6Uvio0wHjHoixIK0s42wkJ8ZXpPhbUQ3traKrF9BRPk+O+EH0gCw7zatTgChKGLmF32hr72vZ7l76cYCoJYxH02ah9/+fLFS3MtlrevFcMmS1C9vLysXWOsw4/YM6epoVySFj3gOoGAXCpG9XSEqi/MPdZovmIZB4PdeiNYJIMdu/ffpFWwd4MXF5iPB3A0+YIKK8E9oULBA1JhAg8cAaJJRsUP1Dzta7wc8nqu0P3LVwWFUJsY9QB1m9+jDBcblGe+K05IwuKeY9j5lL0HoMj5c1606R7r1ua8kdlWNIdZUMEUzQa51A4Pi1D0hblhzQL43RgVIsDyMYBCIA8BdV3fptJdT4TwjIyIveNUIQ4kzg6PoybODmWZeoRd7LCwfOfRuK5cA8Y+uheP5sWaf/+NJk/4TGwUornL+dheOAkBcSYs8rH7Pk2M3Lu1itq6tbnGY12wR7lBrqkQJFPqi6hjrEX4n+CxZGS/9BTfCKFfUwJIjCRZkUPWdCEsluPspOB/13W/I2EHJm23b+GMyyzlGX+GFRfq1s7axiCuO4Rjd5aff7aFCBRHQxpo2shTqcYSBWPri2RirJtYG5RgQowN2VNJbdoUMD1RSDlRqxA+EmOHzl2dwtCQpMJr+pCMQZiaY0hNhX8Rb7WzwyKfhh5RAPBnaTWmlF0SC4GjqezDJyjFsI6MMfRFcsmLTe1D/tE8a9xzuMloWMfjFQ9NIQQagUnd1v5Ly2RGTd3bEpf5M0gQVwwLpqOmK4wH8jC1hPdMcW2Qz0uny3jxqS+SLbeHrHV2+f9maQyzwEQQvLmHa2w8xHcmX7O3EA9Y+yz7zthgO1WcpqBNNdb0nAzg95y5xvARc02FayRhceYax2N+Z2/R7xQGbsV6E59bUyFKYDy55qXr5KIQBz70RdJ1rH/8+PFC+s5beQ+2EQ4SexIjkpN4cpAhkEOPfCetwtOOxhBkx3YqpxCFn0HiCpJN4A1VCEvE987Jhso1YHNzc0EFdcKiUFFcFMM6YiRfy8V7KiSBtb5I2rCW0kg1tXTK6kH0AlNTMqorPCHRXviEPLJUSscEKHbeYBTDOlEwz3kjjGQTV6iB2YZZEV97Ubq53sAyw1ei+eRYtjZHpRZFEl3BkA1FB02UoaRCMljqi+RXK0/+t2RLRQnAgsNUKFiXmBoDZavgQsRA+LGR84drnIR5WVA5Xi/KmP6NRT+gRNkwbG3OGxBnHG9JIDfHFd5YNsgJYqUvkm9pjk5ZlmEPqWR8S8moiuxAS9Go4s81rYIL8fPjx485y4BWQSghQYNK78FYVAwrx8d0bSyeUtrMyAh4rF1yimXZI8oMPnXdc9X4ZuP3hHogDejahhSjOlEs9EXyhrV12ENCXQZruokVMgGZ8LHFn1t6lWJDMptb53IqrXrliK+mdm/y4DwBdPlyjSkJT0R8LxBXPaO0Mcs7YUW/cDmHWJb9SpnB3/mU11PbEKy1E+pIqexzl6Iv7tC6vpM3rAErvAtDgzgJw5qFdW2cwAgqiiv+PNtqJpLZvDZxTCrHJNPEhL1+b12GL3tRn9CAGu+a0yysO8oY5DWwLD7M4aTIMO9k4RqQW+1sTU8Jvia9TodKZZ+7FH1xlzZ9kYVhbc0YFTB8g/qbil1ZVyyrK4xBRZmSWxgMFKEiAWzQptl1AoKqNrnXvZWExdbrzNfpzENujDk8p163fRervBPMGdepa1M7O5f5hRhXRXjMGfWjcg1AZS3KiKIvVrJ2PRbDOm+wo6/IjmjKESI+j/ImlZAmLQvXgCEJYHJUuuP4+1k3hpGa1QeucSiT+vXr1wUFDss6OBJGaW0uHsHW+bW1tTWjfGJ/q7YXsYnlOVRTDzSVfVIJe+hA0Re3aNMXWdTw4d1HbpNCxffv30/IHm1d2ql5SoVsgCZkZevNmycNQVzUlDca2RBMh0UXSABve90yPIPf671iTEUZoGwqVFN/KsfrJQE5cYbqi+QNa+mgVAzrFYgCq8mWShP/NiWI80y51JeGDXdb5uTWDHItyBO8edcY1tkmLiJhUdHJboEuaBQJrkRUy9bmyprJFWUAunAqxjhLpq1CqbuyW8dFX3T8XUocpSepE7HHVy+DIH0yhhfZsZVC8QHiPKngYjvkexgarHicibB8QpSlYS0dFueKoa8oIlzGBrDSPygbqxiWfDK2zKWqbYxs0GrqgXKDXFPhNkVfLJG8Ya1cKF1IKjmEr8+J9RE5PFOsUII0Xou3+gaNUcD8QglhGfO6ApecOc81cZE3sq9dY/jenHz9+vWEIkKZwGaVwLhQyOnt0E8Lh6J0ivTeoJUN8mqKvuhG8oY1TwizWs3CghJClH2vYzMHhyEKeRbMrnalWYCmE64xUk4oCTTeFHi6qAeyWZtR+9/O0lst8bDORGE2UqPyVgONsWvZ2pxxni5qrnWsaJwiWMNDSloqYrez3CAXfXGXNn2RtGGtTHLoSjJhIA0siI7IAxISMqNAYEP/tYf5ECUab1tKDXQ0R/JKr8wdWKGUjosrkLWfVMLibVxzxnINbW5u1q4xKEOX6pG80ltd951Lmso+uW6Qi764S9vaT9aw7iDUu1JTYojnxdxrDSMWHuIQjGvp9nZIhWuUR8vJxGxqQsIGHPFWrgHK5LOkYOX0XJOwyNfdy8Z+DFyVQciww+Tl5eWZJhxEmnkkRYdSjb1PPpTGVJYlM4u+uEubvkjSsIYhB4POk3cySQXJAmnuoxxZCMa1GNVzKvwE3xvXXN5JxfvFhq2rvGLvI15N3dvPnz9nZVjLetcYeK9iPlpXeDCvWx+TAXKdnOEg8FpTQox48lG5BvBarylTir74iVZ9kZxhff/+/edsyH3wZFRfxND8pA8QSHzN3pAHGuN6iphrhH9QMarX4QpP2Ob7Fn3MprKSQG/Dl3/XmbhImaHMZTiLLWHxNprwIWltbvV+J4oxM5Z7yXitpVvnrG2MnHyc0AA08fC5bZBvUfSF4NIXSRjW2CXBK8nHRX/xTuPIV93qAS1SowBHsn0TuFyIYIRx/XKMXS0WB78XlHsJ/1hP7RqgqRkbOsrYzF5lJ3me7bjkTW7Hx9rcFpY3LyhyNLGnVq3NgTh2asXQlyl4D6X++YFiqEWcfuV4vaa8qV0Dir64ITrDGgbTw4cPd/hxAG8kPz7cu3fvL35pvuG/EYx5zeeQkKMN38pujhMFKF/yQLPJwntQJg0T+gIlrQj/Cb7hTxvaSgLsOe21adYkLl5dXdWUCdpje5yOpdAWWvMdrMs8KvNhtkMteapF5M7cNU7W7wkNQORE2SC3UPTFDRp9cY+M2draqtnoJWvQlryZ+PzFaGyGKN+YwHdko/fMZ9km8WYd8/vAG3HCnqs/hipZeA5ZkTzl+wQPNeYKFdxI+I9LAeP1miJEW0mA+uM0rJX1jpOgw7H9ESUCwkHajGfL1uYARqTIzplj6CGPex+j3oI852t6qpHjvL4Gh9qUDbKOoi+uqV0DzA1rX00YAjCUoquz2hcWVM8gaHyXppO/P2eDeM67XBgf2BG/56PThSuWDTtL3sRViIvDJqCZd8Wg7gbiEhWerYoV9F5sChr5Fr4rCSgaSlyk4JnVIGExB4qh0ZbXWwUbXO/bZGXT2twySZPf7xk/vVOMQ8nT85iuN+YR659T5Qn0C6PvVrkGQC9R5hR9odMX5oZ1ilgcNcUEFAALt31eQB9oPOAxgGI+xIkEG9q47hcszO4oo8aIbk4upjjBSAUoJb7WNTkUS2wKGsoZ+Raucej4N/A7uTxd2dSvhjGkGHaemizt0Nq8JiNwLK9Zt3STUIaqTLsxrF2EEYinWtOgA906TU4+SmUfHUVf6PRF8p0XjcjGW93Ak+ecPTGTJhdBuMKIvv2gginshXimGNYo6OATosTj5fTmSZe23mtbGUuYhTKWJLOZaxzPtX1KDGVjIbMExgasW02JVNwXNuxPQ2rWtQp4DPnpndKoxto100+lso+eoi/cFMPaAWKKcvJWL/Pt2zfs4LLbVOSGFP93lloUBR1Ew5918BHk71LDXiPQB4UkaJoIUAaVBDAfJLehFYPTgSC5vLysXWOMW5tfI+tWK593QmnWdRtJOH+t8RgCMXB2rUJrNJV9KMPOqeso+sJNMaxbwAJmoTmnjOEjR1RbMe/KGCI+GuTEgjQIWiiGBqugpWX9SYdj5BMagCK+ekg3x2iQhMXWaz70dCBkNMrWV7tnOD80Ro58hsn6CawDn0UqODk3ZgAyWozqBRmhSVykUmrvJ4q+aKcY1muw3hXHzOfPnw8yMK6h9LPYQKwC85zn+36Ho+WPoTShgHJG2U3SK2eTY2RF6MN56vJD22qaEktYvI0iHGRGnoCRQ8pQhbH7CawDhhbPnWO6Cf2YaX7Hh1EtlA1yR4q+aKcY1itYMqoXVLgGxrXWMxIbCPeBZ56PIrMWnoirp251zF+zcvzoqya5CxGQiI3DQ+URtNowi1Hies9PlD7O8lQ5JH+jMohjiFlr89tgLiN2XelBbPDaT2Ad0rjrpXRHPtD+3tK6NZfRitOE5DfIfSj6Yj2lKsgtilG9HlaOhzwxMcGibjywDDzxvGm43rleXl6e886acgYGEN/jGSnv8XJNcn5+xWun9rl2YJ3wBuiAH0+pYwMgy7UtVR5c1JQwMJBI4Ym1qDMcOh1am5+QBzCnUflD4kVnmt9ZsXbPfBiQWLOyXvA+lby3+vd96mTlBpnQkI4Sg/Xd4Ptd9MVqimG9BIws3vkflt3peuDZvX//PsrgvabIgae6MaqFBRWu7zHKHVKHDVQjMLExkXJM8Ga8xRHqkPXUKGUkCkI4Int/o1+H1XPj0K5KMSbZExCJmZy7xqWasHgbaRLTOsaytfkq+hjXYGntHvPaPePv8XaowdP0GeB1izCLPfwX9aNGyIEvnazcIKNZzTElBt8fyKfBMqroi7tsSCKDs9RIyiBOiC/+K54gR+QRvtamBZf5807WDQWCs6sADwzc7/nt/2TPxMeuJf2gVNlAf0yJwRuoQ/5uL3sKpn+R9QXBCSG14MffLPgueP78JLRYkMG7gBKLj/CeOKK1KK+4YgM1GDlSrNrGTLk+fcMep1NXd9acTv8gDxFH6hj2lufEHvn/LCh1drwxsHsu7p944lF69RPW6+1wE/53s2Znsm5nA4yZ27zwrZMh41JwEvXggq/tr2RI0Rf/T/Yea3hUEJhevNTdEO/IE57sqBrynCJBFu0+Giyset3VRS0nUHGA7/HZ0A2UCNpq+f9YIN5p7IP/k/HXz/8MbPzT3GsWkjUZI8ZD25CaEkUSFp1GGxRULiF10jijdcyGcWvzls8CXbbPn2dOA8L2ZM3jUa1arzLm3/9v1sPG8O6356iV7COe+jaayj6JYn5ti774f3JOXqz5sfv169dnxajuB64b4q5ZCD7pmDgzFThWfLLOqAb8PZI9vu8DDAa+x/DGR1UqDUYd3+vHbfe6L5q6t/z6n5QgEgKiSlj07W0MDVecddPanEYCJ3Ismx9HIpubcqfwUj8Zw6gWvIbnBIyXutxFX9yQlWEtC/cVhA1fwF0fSjdHIASxmPj6PgtRiOMz8QNeauex9Iaui1p2LCnp0EsS1vicOMrztWFmj8zMNYZPPmpKkHv37j3XeKPYm5Rch0UXfM+dxqAypteMZUMnVAO70cti2Iy2GcMmJ+PTyZo8kru+yMGwPpcycfBO/4obnsvx5NggQzgkA3tJYD/hz3Wm+R0k7VBhJaKkDxqBGUpDHXwOrHFWkk80mycDKtcANiwXlBjirXbGHiK8jhVVjic/mvKKk3hIofekOkswBvYtg3o+9skxb5ArypQx6nLnrC+ij7HGRWIldiEXa8H/9QnPqEk8NMO00A+pWYsyPBXfiwP++alRMouWmr1Hb/lx0vX+Y/yDBw8uRv68USGC6ECSpBBr+3RoolRXmgQXqeRzNuY6V8TKXqRoWCJ20jVGmnhEdQxsBXSOK87TR2tzLbJu57xsj7BuJTdmCkO/hmEjlUcm08++umFGwKh2UY76Itms9UJYsLGKhbQnRokPgVbTTdxYXUJ8pkE2Utf32LAywDWNYOTnP/n5rGyaC4Xh4BSCNwR7fer8akF4HUKj+D3eW9ROLqRByvqiGNaF0VlqGICF9ZuUyplpSuXIgkHMdLNoFlN7Pgqrae5zc29RFgn/3SZAm2NqHvNJFDI8oOclfKtQ8A+MHdQAxpqFwaOVy0DkMk6O4RnEyfF5WbsFLSnpi2JYF4JCsuZXLqQioAuFQmF82uQy3UTQFcdGoSD8H6Ghc9VOW7KEAAAAAElFTkSuQmCC"
          />
        </defs>
      </svg>
      <div id="menu">
        <a id="phone" href="tel:+79110029070" target="_blank"
          >+7 911 002 90 70</a
        >
        <a id="whatsapp" href="whatsapp:+79110029070" target="_blank">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <mask
              id="mask0_2379_174"
              style="mask-type: alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="12"
              height="12"
            >
              <rect width="12" height="12" fill="url(#pattern0_2379_174)" />
            </mask>
            <g mask="url(#mask0_2379_174)">
              <rect width="12" height="12" fill="url(#pattern1_2379_174)" />
              <rect width="12" height="12" fill="white" />
            </g>
            <defs>
              <pattern
                id="pattern0_2379_174"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlink:href="#image0_2379_174" transform="scale(0.004)" />
              </pattern>
              <pattern
                id="pattern1_2379_174"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlink:href="#image0_2379_174" transform="scale(0.004)" />
              </pattern>
              <image
                id="image0_2379_174"
                width="250"
                height="250"
                preserveAspectRatio="none"
                xlink:href="data:image/png;base64,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"
              />
            </defs>
          </svg>
          <p>WhatsApp</p>
        </a>
        <a id="telegram" href="https://t.me/+79110029070" target="_blank">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <mask
              id="mask0_2379_178"
              style="mask-type: alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="12"
              height="12"
            >
              <rect width="12" height="12" fill="url(#pattern0_2379_178)" />
            </mask>
            <g mask="url(#mask0_2379_178)">
              <rect width="12" height="12" fill="url(#pattern1_2379_178)" />
              <rect width="12" height="12" fill="white" />
            </g>
            <defs>
              <pattern
                id="pattern0_2379_178"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlink:href="#image0_2379_178" transform="scale(0.004)" />
              </pattern>
              <pattern
                id="pattern1_2379_178"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlink:href="#image0_2379_178" transform="scale(0.004)" />
              </pattern>
              <image
                id="image0_2379_178"
                width="250"
                height="250"
                preserveAspectRatio="none"
                xlink:href="data:image/png;base64,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"
              />
            </defs>
          </svg>
          <p>Telegram</p>
        </a>
      </div>
    </footer>
  </body>
</html>

    `;

    await page.setContent(html);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    const timestamp = Date.now();
    const filename = `bigspaces_${timestamp}.pdf`;
    const filePath = `download/noco/bigspaces/attachment/${filename}`;

    const fileForm = new FormData();
    fileForm.append('file', pdf, {
      filename,
      contentType: 'application/pdf',
    });
    fileForm.append('mimetype', 'application/pdf');
    fileForm.append('title', filename);
    fileForm.append('path', filePath);

    const uploadRes = await axios.post(
      `${process.env.NOCO_URL}/api/v2/storage/upload`,
      fileForm,
      {
        headers: {
          ...fileForm.getHeaders(),
          'xc-token': process.env.NOCO_TOKEN!,
        },
      },
    );

    console.log('NocoDB uploadRes.data:', uploadRes.data);

    const uploadDataArr = Array.isArray(uploadRes.data)
      ? uploadRes.data
      : [uploadRes.data];
    const uploadData = uploadDataArr[0];
    const fileField = [
      {
        path: uploadData.path,
        title: uploadData.title,
        mimetype: uploadData.mimetype,
        size: uploadData.size,
      },
    ];

    console.log('NocoDB fileField:', JSON.stringify(fileField, null, 2));

    const payload = {
      name: data.person.name,
      phone: data.person.phone,
      mail: data.person.mail,
      file: fileField,
    };

    console.log('NocoDB payload:', JSON.stringify(payload, null, 2));

    await axios.post(
      `${process.env.NOCO_URL}/api/v2/tables/mzioudu6v07b4on/records`,
      [payload],
      {
        headers: {
          'Content-Type': 'application/json',
          'xc-token': process.env.NOCO_TOKEN!,
        },
      },
    );

    return pdf;
  }

  async getData() {
    try {
      const response = await axios.get(
        `${process.env.NOCO_URL}/api/v2/tables/mgi2ijypvo7j4zl/records`,
        {
          headers: {
            'xc-token': process.env.NOCO_TOKEN!,
          },
        },
      );
      return response.data;
    } catch (e) {
      // Можно залогировать ошибку, если нужно
      return null;
    }
  }
}
