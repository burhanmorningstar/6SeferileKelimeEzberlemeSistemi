<a name="readme-top"></a>

<p align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</p>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Word memorization system in 6 repetitions</h3>
  <p align="center">
    Learning English words has never been so easy!
    <br />
    <a href="https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi"><strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#Team">Team Members</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Screen Shot][product-screenshot]](/website/images/quizScreen.png)

This website is a knowledge game that aims to help users learn English through interactive quizzes. The game has a user registration, login and password recovery system. Users can add words to the game, including English equivalents, sentences containing the words, pictures related to the words, and optional audio pronunciations. The game includes a quiz module where users must answer questions correctly six times in a row to demonstrate their mastery. The system then schedules retests for these mastered words at intervals ranging from 1 day to 1 year. Users can also customize the number of new words presented in each session. Furthermore, users can generate analysis reports showing their learning progress and success rates.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![HTML5][Html.com]][Html-url]
- [![CSS3][Css.com]][Css-url]
- [![Bootstrap][Bootstrap.com]][Bootstrap-url]
- [![JQuery][JQuery.com]][JQuery-url]
- [![Node.js][NodeJs.com]][NodeJs-url]
- [![Express.js][ExpressJs.com]][ExpressJs-url]
- [![MySQL][MySQL.com]][MySQL-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Team -->

## Team

- Burhan İsmail Demir - [![Github][Github.com]](https://github.com/burhanmorningstar) - Project Lead/Backend Developer
- Aybars Mete Keleş - [![Github][Github.com]](https://github.com/aybavs) - Frontend Developer
- Yiğit Akdaş - [![Github][Github.com]](https://github.com/yigitakdas7) - Designer
- İbrahim Uğurlu - [![Github][Github.com]](https://github.com/miugurlu) - Data Scientist

Project Link: [https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi](https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started


### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi.git
   ```
2. Install NPM packages
   ```sh
   npm install express
   npm install multer
   npm install mysql
   npm install cors
   npm install path
   npm install fs
   npm install body-parser
   npm install bcryptjs
   npm install http
   npm install randomstring
   npm install nodemailer
   ```
3. Start NodeJs Servers
    Open four separate cmd tabs and paste the following codes into each of them.
    ```sh
    cd api
    node userApi.js
    ```
    ```sh
    cd api
    node userAnalyzes.js
    ```
    ```sh
    cd api
    node wordApi.js
    ```
    ```sh
    cd api
    node wordAddApi.js
    ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

[![Product Screen Shot][signup-screenshot]](/website/images/signup.png)

This screen allows users to register for the knowledge game. The registration process is straightforward, requiring users to enter their personal information, create a username, and set a password. Once registered, users can start adding words and participating in quizzes to enhance their English vocabulary.

[![Product Screen Shot][login-screenshot]](/website/images/login.png)

The login screen enables returning users to access their accounts. Users can enter their credentials to log in and continue their learning journey. If they forget their password, they can use the password recovery feature to regain access to their account.

[![Product Screen Shot][product-screenshot]](/website/images/quizScreen.png)

The quiz module is the core of the knowledge game. Users are presented with quizzes where they must answer questions correctly six times in a row to demonstrate their mastery of each word. The system then schedules retests for these mastered words at intervals ranging from 1 day to 1 year to reinforce learning.

[![Product Screen Shot][settings-screenshot]](/website/images/settings.png)

The settings screen allows users to customize their learning experience. Users can adjust the number of new words presented in each session, modify their personal information, and manage other preferences related to their account and the game.

[![Product Screen Shot][print-screenshot]](/website/images/print.png)
The analysis report feature provides users with detailed insights into their learning progress. Users can generate reports showing their success rates and progress across different topics. These reports can be printed for personal records or further analysis.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/burhanmorningstar/6SeferileKelimeEzberlemeSistemi.svg?style=for-the-badge
[contributors-url]: https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/burhanmorningstar/6SeferileKelimeEzberlemeSistemi.svg?style=for-the-badge
[forks-url]: https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/network/members
[stars-shield]: https://img.shields.io/github/stars/burhanmorningstar/6SeferileKelimeEzberlemeSistemi.svg?style=for-the-badge
[stars-url]: https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/stargazers
[issues-shield]: https://img.shields.io/github/issues/burhanmorningstar/6SeferileKelimeEzberlemeSistemi.svg?style=for-the-badge
[issues-url]: https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/issues
[license-shield]: https://img.shields.io/github/license/burhanmorningstar/6SeferileKelimeEzberlemeSistemi.svg?style=for-the-badge
[license-url]: https://github.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/burhanmorningstar
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
[Html.com]: https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white
[Html-url]: https://html.com
[Css.com]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[Css-url]: https://css3.com
[Javascript.com]: https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square
[Javascript-url]: https://javascript.com
[NodeJs.com]: https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white
[NodeJs-url]: https://nodejs.org
[ExpressJs.com]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[ExpressJs-url]: https://expressjs.com
[Github.com]: https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white
[MySQL.com]: https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://mysql.com
[product-screenshot]: https://raw.githubusercontent.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/main/website/images/quizScreen.png
[signup-screenshot]: https://raw.githubusercontent.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/main/website/images/signup.png
[login-screenshot]: https://raw.githubusercontent.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/main/website/images/login.png
[print-screenshot]: https://raw.githubusercontent.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/main/website/images/print.png
[settings-screenshot]: https://raw.githubusercontent.com/burhanmorningstar/6SeferileKelimeEzberlemeSistemi/main/website/images/settings.png
