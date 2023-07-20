import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import { Request, Response } from 'express';

export default {
    get: (req: Request, res: Response) => {
        const obj = {
            id: "3210555b8c10",
            widget: "TextBlock",
            data: {
                "text": "<p>Example text</p>"
            }
        };

        const widget = {
            name: "Widget 1",
            description: "This is a template widget for test purposes only",
            author: { completeName: "Javier" },
            grupo: "grupo1",
            type: "Callout",
            content: JSON.stringify(obj)
        }

        const json: Object[] = []
        for (let i = 0; i < 10; i++) {
            let elem = { ...widget };
            elem.name = "Widget " + i;
            json.push(elem);
        }

        res.send([
            {
                "id": 23,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"272ccbfa1ab8\",\"data\":[{\"id\":\"945f1e704584\",\"data\":[{\"id\":\"1b6ae6c89698\",\"data\":{\"text\":\"<p>To achieve its goals, INDIe has built a strong team which strength relies on the diversity of profiles, of cultures, of background of educational contexts and practice:\\n</p><ul><li>Three countries from across Europe.</li><li>Two universities, two regional educational authorities, five secondary schools, one with a strong focus on vocational training, two primary schools and one non-profit organization.</li><li>A good gender balance, for example in the kick-off meeting: 15 female and 17 male participants.</li></ul>\"},\"widget\":\"TextBlock\"}],\"params\":{\"title\":\"INDIe team\"},\"widget\":\"AcordionContent\"},{\"id\":\"ec2d077e2bb7\",\"data\":[{\"id\":\"63a215c0a41e\",\"data\":{\"text\":\"<p>The INDIe4All consortium was built in a complementary perspective with partners with different profiles: a higher education institution with a strong technological know-how; organisations - a charity and specialised schools - with expertise and decades of experience in the education of students with visual impairment and additional disabilities; mainstream high schools with visually impaired students; a regional authority for education which in charge of attending students with educational needs in the Region of Murcia, and finally, a Greek association of teachers who share the passion to promote STEM subjects in education.</p>\"},\"widget\":\"TextBlock\"}],\"params\":{\"title\":\"INDIe4All team\"},\"widget\":\"AcordionContent\"}],\"params\":{\"help\":\"\",\"name\":\"Acordion-272ccbfa1ab8\"},\"widget\":\"AcordionContainer\"}",
                "type": "AcordionContainer",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget acordeón [Pablo]",
                "description": "Ejemplo de muestra del Widget acordeón",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T07:52:29Z",
                "updatedAt": "2023-07-18T11:00:47Z"
            },
            {
                "id": 24,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"32a22517814a\",\"data\":{\"answer\":\"MANZANA\",\"attempts\":\"6\",\"question\":\"¿A qué objeto situado sobre la cabeza de su hijo apuntaba con su arco Guillermo Tell?\"},\"params\":{\"help\":\"\",\"name\":\"Guess the word-32a22517814a\"},\"widget\":\"GuessWord\"}",
                "type": "GuessWord",
                "group": "Actividades gamificadas",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget adivina la palabra [Pablo]",
                "description": "Ejemplo de widget adivina la palabra",
                "tags": [
                    "GuessWord",
                    "Adivina",
                    "Palabra"
                ],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T07:53:32Z",
                "updatedAt": "2023-07-18T11:00:36Z"
            },
            {
                "id": 25,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"77e16bcd8df4\",\"data\":{\"alt\":\"Plano de una casa\",\"blob\":\"\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/3c54ed1199df448d9c515d2bee7a99cd.png\",\"pieces\":[{\"h\":\"50\",\"w\":\"150\",\"x\":\"7.56919060052219\",\"y\":\"11.215404699738903\",\"altImg\":\"Bathroom\",\"altRec\":\"Lugar donde nos aseamos\"},{\"h\":\"50\",\"w\":\"150\",\"x\":\"13.646214099216701\",\"y\":\"132.75587467362925\",\"altImg\":\"Hall\",\"altRec\":\"Sala situada a la entrada del piso\"},{\"h\":\"50\",\"w\":\"150\",\"x\":\"16.077023498694516\",\"y\":\"278.6044386422976\",\"altImg\":\"Living room\",\"altRec\":\"Sala con televisión donde las personas se relajan\"},{\"h\":\"50\",\"w\":\"150\",\"x\":\"11.215404699738901\",\"y\":\"460.91514360313306\",\"altImg\":\"Terrace\",\"altRec\":\"Espacio al aire libre en un piso\"},{\"h\":\"50\",\"w\":\"150\",\"x\":\"767.1971279373362\",\"y\":\"130.3250652741514\",\"altImg\":\"Bedroom\",\"altRec\":\"Sala de la casa donde se duerme\"},{\"h\":\"50\",\"w\":\"150\",\"x\":\"759.9046997389036\",\"y\":\"253.08093994778082\",\"altImg\":\"Dining room\",\"altRec\":\"Lugar donde se cena y come\"},{\"h\":\"50\",\"w\":\"150\",\"x\":\"763.5509138381198\",\"y\":\"363.6827676240207\",\"altImg\":\"Kitchen\",\"altRec\":\"Sala en la que se prepara la comida\"}]},\"params\":{\"help\":\"\",\"name\":\"Animation-77e16bcd8df4\"},\"widget\":\"Animation\"}",
                "type": "Animation",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget animación [Pablo]",
                "description": "Ejemplo de widget animación",
                "tags": [
                    "Animación",
                    "Animation"
                ],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T07:54:16Z",
                "updatedAt": "2023-07-18T11:00:24Z"
            },
            {
                "id": 27,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"4aef43cdb47b\",\"data\":[{\"id\":\"02cd4c001e6e\",\"data\":{\"term\":\"Madrid\",\"definition\":\"España\"},\"widget\":\"DragdropItem\"},{\"id\":\"4c7cb9d65317\",\"data\":{\"term\":\"París\",\"definition\":\"Francia\"},\"widget\":\"DragdropItem\"},{\"id\":\"d8ff1082aa5e\",\"data\":{\"term\":\"Roma\",\"definition\":\"Italia\"},\"widget\":\"DragdropItem\"},{\"id\":\"bf66b9929c92\",\"data\":{\"term\":\"Berlín\",\"definition\":\"Alemania\"},\"widget\":\"DragdropItem\"}],\"params\":{\"help\":\"Enlaza cada capital con su país\",\"name\":\"Drag And Drop-4aef43cdb47b\"},\"widget\":\"DragdropContainer\"}",
                "type": "DragdropContainer",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget arrastrar y soltar [Pablo]",
                "description": "Ejemplo de arrastrar y soltar",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:05:35Z",
                "updatedAt": "2023-07-18T11:00:16Z"
            },
            {
                "id": 28,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"02f25098fe49\",\"data\":[{\"id\":\"437bf12dde1e\",\"data\":{\"term\":\"Gruñido\",\"audio\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/d06b247b14554818813fd784e6b26eeb.mp3\",\"captions\":\"\",\"definition\":\"Lo hace un perro cuando está enfadado\"},\"widget\":\"AudioTermItem\"},{\"id\":\"fc3178ce4eed\",\"data\":{\"term\":\"Godzilla\",\"audio\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/1ca3157a4d054f1384cb41d1a69e6848.mp3\",\"captions\":\"\",\"definition\":\"Si lo oyes, ¡corre!\"},\"widget\":\"AudioTermItem\"}],\"params\":{\"help\":\"\",\"name\":\"Audio Term Container-02f25098fe49\"},\"widget\":\"AudioTermContainer\"}",
                "type": "AudioTermContainer",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget audio términos [Pablo]",
                "description": "Ejemplo de audio términos",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:06:04Z",
                "updatedAt": "2023-07-18T11:00:04Z"
            },
            {
                "id": 29,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"07d8719e758d\",\"data\":{\"text\":\"<p>Un bloque de texto con texto editado</p>\",\"style\":\"default\"},\"widget\":\"TextBlock\"}",
                "type": "TextBlock",
                "group": null,
                "mode": "ORIGINAL",
                "creativeCommons": "BY",
                "language": "EN",
                "name": "Widget de bloque de texto [Pablo]",
                "description": "Ejemplo de bloque de texto",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:06:27Z",
                "updatedAt": "2023-07-10T11:19:58Z"
            },
            {
                "id": 30,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"ae2972318666\",\"data\":[{\"id\":\"ed410eac82b9\",\"data\":{\"alt\":\"Planta\",\"text\":\"<p>Texto 1</p>\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/4d82ad36890a4033be6c719c43e735a5.png\"},\"widget\":\"ButtonTextItem\"},{\"id\":\"3292e2ffbd47\",\"data\":{\"alt\":\"Mano\",\"text\":\"<p>Texto 2</p>\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/1a296152eb244341bec81976df4ef847.png\"},\"widget\":\"ButtonTextItem\"},{\"id\":\"e07078810e06\",\"data\":{\"alt\":\"Reciclaje\",\"text\":\"<p>Texto 3</p>\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/5cee4822bf164fae8fff3785d489f2da.png\"},\"widget\":\"ButtonTextItem\"},{\"id\":\"1e03f4fdc53f\",\"data\":{\"alt\":\"Reloj\",\"text\":\"<p>Texto 4</p>\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/92b89c67c54847adb1eaa494b3a06618.png\"},\"widget\":\"ButtonTextItem\"}],\"params\":{\"help\":\"\",\"name\":\"Buttons with text-ae2972318666\"},\"widget\":\"ButtonTextContainer\"}",
                "type": "ButtonTextContainer",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de botones y texto [Pablo]",
                "description": "Ejemplo de botones y texto",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:06:49Z",
                "updatedAt": "2023-07-18T10:59:44Z"
            },
            {
                "id": 31,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"986826fd2e17\",\"data\":{\"quote\":\"La ignorancia hace la felicidad\",\"source\":\"\",\"caption\":\"Anónimo\",\"alignment\":\"left\"},\"widget\":\"Blockquote\"}",
                "type": "Blockquote",
                "group": "Contenido didáctico",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de Cita",
                "description": "Ejemplo de Cita",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:07:11Z",
                "updatedAt": "2023-07-18T10:59:32Z"
            },
            {
                "id": 32,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"351225f228c0\",\"data\":[{\"id\":\"01d2c9e6c294\",\"data\":{\"terms\":[\"Alto\",\"Bajo\",\"Delgado\",\"Listo\",\"Cómodo\",\"Valiente\"],\"column\":\"Adjetivos\"},\"widget\":\"TermClassificationItem\"},{\"id\":\"3077b8c01a59\",\"data\":{\"terms\":[\"Pablo\",\"Perro\",\"Águila\",\"Zanahoria\",\"Río\",\"Saltamontes\"],\"column\":\"Nombres\"},\"widget\":\"TermClassificationItem\"}],\"params\":{\"help\":\"\",\"name\":\"Terms and Classification-351225f228c0\"},\"widget\":\"TermClassification\"}",
                "type": "TermClassification",
                "group": "Actividades gamificadas",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de clasificación [Pablo]",
                "description": "Ejemplo de clasificación",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:07:27Z",
                "updatedAt": "2023-07-18T10:59:21Z"
            },
            {
                "id": 33,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"e3f7a6bd42a4\",\"data\":[[{\"id\":\"6a900e4b9590\",\"data\":{\"text\":\"<p>Texto de la primera columna</p>\"},\"widget\":\"TextBlock\"}],[{\"id\":\"6fb8f5a73347\",\"data\":{\"text\":\"<p>Texto de la segunda columna</p>\"},\"widget\":\"TextBlock\"}],[{\"id\":\"43e717ef6ae9\",\"data\":{\"text\":\"<p>Texto de la tercera columna</p>\"},\"widget\":\"TextBlock\"}],[{\"id\":\"cc0d947cd296\",\"data\":{\"text\":\"<p>Texto de la cuarta columna</p>\"},\"widget\":\"TextBlock\"}]],\"widget\":\"FourColumnsLayout\"}",
                "type": "FourColumnsLayout",
                "group": "Contenido didáctico",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de cuatro columnas [Pablo]",
                "description": "Ejemplo de cuatro columnas",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:07:59Z",
                "updatedAt": "2023-07-18T10:57:46Z"
            },
            {
                "id": 34,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"f788b4067faf\",\"data\":[{\"id\":\"f5e7765281ce\",\"data\":{\"text\":\"<p>Bien, he captado tu atención</p>\"},\"widget\":\"TextBlock\"},{\"id\":\"42f79e8a29af\",\"data\":[[{\"id\":\"d257797431b3\",\"data\":{\"alt\":\"Logo de indie4all\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/8ab98b8efe9d40afba8bdc7a4c3e3638.png\",\"width\":\"500\",\"height\":\"404\"},\"params\":{\"name\":\"Simple image-d257797431b3\",\"align\":\"left\",\"aspect\":\"original\"},\"widget\":\"SimpleImage\"}],[{\"id\":\"55de3683bb26\",\"data\":{\"alt\":\"Logo de INDIe\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/bbca0e820ddc48acb2451a1065a8e31e.png\",\"width\":\"500\",\"height\":\"404\"},\"params\":{\"name\":\"Simple image-55de3683bb26\",\"align\":\"left\",\"aspect\":\"original\"},\"widget\":\"SimpleImage\"}]],\"params\":{\"firstColumnWidth\":\"6\"},\"widget\":\"TwoColumnsLayout\"}],\"params\":{\"text\":\"Atención\",\"style\":\"attention\",\"animation\":\"simple\",\"colorTheme\":\"\"},\"widget\":\"Callout\"}",
                "type": "Callout",
                "group": "Contenido didáctico",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de destacado [Pablo]",
                "description": "Ejemplo de destacado",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:08:19Z",
                "updatedAt": "2023-07-18T10:57:33Z"
            },
            {
                "id": 35,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"106520142028\",\"data\":[[{\"id\":\"0c3dbea823dc\",\"data\":{\"text\":\"<p>Texto de la primera columna</p>\"},\"widget\":\"TextBlock\"}],[{\"id\":\"4a7d5f99de8e\",\"data\":{\"text\":\"<p>Texto de la segunda columna</p>\"},\"widget\":\"TextBlock\"}]],\"params\":{\"firstColumnWidth\":\"6\"},\"widget\":\"TwoColumnsLayout\"}",
                "type": "TwoColumnsLayout",
                "group": "Contenido didáctico",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de dos columnas [Pablo]",
                "description": "Ejemplo de dos columnas",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:08:37Z",
                "updatedAt": "2023-07-18T10:57:21Z"
            },
            {
                "id": 36,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"291f874a32d1\",\"data\":{\"alt\":\"Logo de INDIe4All\",\"text\":\"What is INDIe4All?\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/8ab98b8efe9d40afba8bdc7a4c3e3638.png\",\"options\":[{\"text\":\"The continuation of INDIe\",\"correct\":true},{\"text\":\"A mexican dish\",\"correct\":false},{\"text\":\"A Beyoncé song\",\"correct\":false},{\"text\":\"A country dance\",\"correct\":false}]},\"params\":{\"help\":\"\",\"name\":\"Choose option-291f874a32d1\"},\"widget\":\"ChooseOption\"}",
                "type": "ChooseOption",
                "group": "Actividades gamificadas",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de escoger opción [Pablo]",
                "description": "Ejemplo de escoger opción",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:08:58Z",
                "updatedAt": "2023-07-18T10:57:08Z"
            },
            {
                "id": 37,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"a43c2a532df2\",\"data\":[{\"id\":\"ae0ccebbf7ec\",\"data\":{\"alt\":\"Logo de indie4all\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/8ab98b8efe9d40afba8bdc7a4c3e3638.png\"},\"widget\":\"SchemaItem\"},{\"id\":\"6db5da414a4a\",\"data\":{\"alt\":\"Logo de INDIe\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/bbca0e820ddc48acb2451a1065a8e31e.png\"},\"widget\":\"SchemaItem\"}],\"params\":{\"help\":\"\",\"name\":\"Schema-a43c2a532df2\"},\"widget\":\"SchemaContainer\"}",
                "type": "SchemaContainer",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de esquema [Pablo]",
                "description": "Ejemplo de esquema",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:10:00Z",
                "updatedAt": "2023-07-18T10:56:44Z"
            },
            {
                "id": 38,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"c3893ec85532\",\"data\":{\"caption\":\"Fórmula de la raíz cuadrada\",\"formula\":\"\\\\text{La Fórmula Cuadrática es }x = \\\\frac {-b \\\\pm \\\\sqrt {b^2 - 4ac}}{2a}\"},\"widget\":\"LatexFormula\"}",
                "type": "LatexFormula",
                "group": "Contenido didáctico",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de fórmula LaTeX [Pablo]",
                "description": "Ejemplo de fórmula LaTeX",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:10:24Z",
                "updatedAt": "2023-07-18T10:56:33Z"
            },
            {
                "id": 39,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"d610b4ab93a9\",\"data\":{\"alt\":\"Debes proporcionar un texto alternativo para la imagen\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/5b65139613e74db48bad124ae56fb451.jpg\",\"width\":\"1000\",\"height\":\"1000\"},\"params\":{\"name\":\"Simple image-d610b4ab93a9\",\"align\":\"left\",\"aspect\":\"original\"},\"widget\":\"SimpleImage\"}",
                "type": "SimpleImage",
                "group": "Contenido didáctico",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de imagen [Pablo]",
                "description": "Ejemplo de imagen",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:10:46Z",
                "updatedAt": "2023-07-18T10:56:21Z"
            },
            {
                "id": 40,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"9b76c0d3346e\",\"data\":{\"alt\":\"europe map\",\"text\":\"<p>Both INDIe and INDIe4all are therefore perfectly aligned with the recently announced Digital Education Action Plan (2021-27) which states two strategic priorities:\\n</p><p>Digitally-competent and –confident educators and education &amp; training staff.\\n</p><p>High quality content, user-friendly tools and secure platforms, respecting privacy and ethical standards.</p>\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/5b65139613e74db48bad124ae56fb451.jpg\"},\"params\":{\"help\":\"\",\"name\":\"Image-9b76c0d3346e\"},\"widget\":\"Image\"}",
                "type": "Image",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de imagen con texto encima [Pablo]",
                "description": "Ejemplo de imagen con texto encima",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:11:09Z",
                "updatedAt": "2023-07-18T10:56:09Z"
            },
            {
                "id": 41,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"e802cf9e0dc1\",\"data\":[{\"id\":\"50a76afd0d96\",\"data\":{\"alt\":\"Logo de indie4all\",\"text\":\"Un perro gruñendo\",\"audio\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/d06b247b14554818813fd784e6b26eeb.mp3\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/8ab98b8efe9d40afba8bdc7a4c3e3638.png\",\"captions\":\"\"},\"widget\":\"ImageAndSoundItem\"}],\"params\":{\"help\":\"\",\"name\":\"Image and Sound-e802cf9e0dc1\"},\"widget\":\"ImageAndSoundContainer\"}",
                "type": "ImageAndSoundContainer",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de imagen y sonido [Pablo]",
                "description": "Ejemplo de imagen y sonido",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:11:31Z",
                "updatedAt": "2023-07-18T10:55:57Z"
            },
            {
                "id": 42,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"cca04b215e1a\",\"data\":{\"alt\":\"Logo de Indie4all\",\"text\":\"<p>INDIe4All takes over the mission of INDIe, focusing on making the generated learning units accessible for students with disabilities. This will be done by modifying INDIeGenerator, the horsepower under INDIeAuthor, which transforms the specification of the structure and content of the learning unit into chunks of code (HTML5, CSS3, Javascript) that build up the unit’s webpages. On the one hand, the generated code chunks will comply with accessibility standards, and on the other hand new interactive activities will be introduced to substitute the ones that are difficult to adapt, as is a drag and drop activity for example.</p>\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/8ab98b8efe9d40afba8bdc7a4c3e3638.png\",\"layout\":0},\"params\":{\"help\":\"\",\"name\":\"Image and Text-cca04b215e1a\"},\"widget\":\"ImageAndText\"}",
                "type": "ImageAndText",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de imagen y texto [Pablo]",
                "description": "Ejemplo de imagen y texto",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:11:56Z",
                "updatedAt": "2023-07-18T10:55:42Z"
            },
            {
                "id": 43,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"74f633770af3\",\"data\":[{\"id\":\"5125e05055a2\",\"data\":[{\"id\":\"d5b2ac54c8cf\",\"data\":{\"text\":\"<p>Give access to digitally skilled teachers to the authoring tool INDIeAuthor which is being developed within the Digital Content Production Center of the Universidad Politécnica de Cartagena.</p>\"},\"widget\":\"TextBlock\"}],\"params\":{\"name\":\"Create\"},\"widget\":\"TabContent\"},{\"id\":\"9626a9baaaa8\",\"data\":[{\"id\":\"df7b34a51c2d\",\"data\":{\"text\":\"<p>Develop a repository, INDIeOpen, for publication of learning units created with INDIeAuthor. The repository will include a search functionality and a rating system with inclusion of comments.</p>\"},\"widget\":\"TextBlock\"}],\"params\":{\"name\":\"Share\"},\"widget\":\"TabContent\"},{\"id\":\"1adc1b9572ce\",\"data\":[{\"id\":\"4fb94fa7c4da\",\"data\":{\"text\":\"<p>Produce a set of of open learning units and upload them to the repository from a variety of subjects and school levels.</p>\"},\"widget\":\"TextBlock\"}],\"params\":{\"name\":\"Learn\"},\"widget\":\"TabContent\"}],\"params\":{\"help\":\"\",\"name\":\"Tabs menu-74f633770af3\"},\"widget\":\"TabsContainer\"}",
                "type": "TabsContainer",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget menú de pestañas [Pablo]",
                "description": "Ejemplo de menú de pestañas",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:12:47Z",
                "updatedAt": "2023-07-18T11:01:01Z"
            },
            {
                "id": 44,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"03deb659ad31\",\"data\":[{\"id\":\"07a3f1e56337\",\"data\":{\"sentence\":\"Un día vi una [blank] vestida de uniforme\",\"combinations\":[\"vaca\"]},\"widget\":\"MissingWordsItem\"}],\"params\":{\"help\":\"Completa la siguiente conocida regla nemotécnica para la integración por partes\",\"name\":\"Missing Words-03deb659ad31\"},\"widget\":\"MissingWords\"}",
                "type": "MissingWords",
                "group": "Preguntas de evaluación",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de palabras faltantes [Pablo]",
                "description": "Ejemplo de palabras faltantes",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:13:18Z",
                "updatedAt": "2023-07-18T10:55:11Z"
            },
            {
                "id": 45,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"c648b92948a7\",\"data\":[{\"id\":\"8044dfffb00e\",\"data\":{\"words\":[\"3+4\",\"4x3\",\"5x2\",\"6+5\"],\"answers\":[\"3+4 5x2 6+5 4x3\"]},\"widget\":\"SentenceOrderItem\"}],\"params\":{\"help\":\"Ordena las siguientes operaciones matemáticas por su resultado, de menor a mayor.\",\"name\":\"Sentence Order-c648b92948a7\"},\"widget\":\"SentenceOrderContainer\"}",
                "type": "SentenceOrderContainer",
                "group": "Preguntas de evaluación",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de ordenamiento de frases",
                "description": "Ejemplo de ordenamiento de frases",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:13:41Z",
                "updatedAt": "2023-07-18T10:54:46Z"
            },
            {
                "id": 46,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"20bb487ba336\",\"data\":[{\"id\":\"29a78b6c49e9\",\"data\":{\"alt\":\"Una persona que da clases y sus estudiantes toman notas con bolígrafo y cuadernos\",\"word\":\"Profesor\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/ea71f4895a254d49af1a7e5a787c33cc.png\",\"question\":\"¿Cuál es la profesión de la siguiente persona?\"},\"widget\":\"CorrectWordItem\"},{\"id\":\"521151c95626\",\"data\":{\"alt\":\"Un tubo cilíndrico metálico o de vidrio con una punta en un extremo que fija tinta a un soporte físico sobre la que se arrastra\",\"word\":\"Bolígrafo\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/2a108775770e49b6b7f3467cc64b2671.png\",\"question\":\"¿Qué objeto es este?\"},\"widget\":\"CorrectWordItem\"}],\"params\":{\"help\":\"\",\"name\":\"Correct word-20bb487ba336\"},\"widget\":\"CorrectWord\"}",
                "type": "CorrectWord",
                "group": "Preguntas de evaluación",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de palabra correcta [Pablo]",
                "description": "Ejemplo de palabra correcta",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:14:36Z",
                "updatedAt": "2023-07-18T10:54:33Z"
            },
            {
                "id": 47,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"ed630337b1ee\",\"data\":[{\"id\":\"3fd46cd1f300\",\"data\":{\"couples\":[{\"alt\":\"\",\"text\":\"<p>INDIe4All logo</p>\",\"type\":\"text\",\"image\":\"\"},{\"alt\":\"Logo de Indie4all\",\"text\":\"\",\"type\":\"image\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/8ab98b8efe9d40afba8bdc7a4c3e3638.png\"}]},\"widget\":\"CouplesItem\"},{\"id\":\"55a0b4a2569a\",\"data\":{\"couples\":[{\"alt\":\"\",\"text\":\"<p>INDIe logo</p>\",\"type\":\"text\",\"image\":\"\"},{\"alt\":\"Logo de INDIe\",\"text\":\"\",\"type\":\"image\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/bbca0e820ddc48acb2451a1065a8e31e.png\"}]},\"widget\":\"CouplesItem\"}],\"params\":{\"help\":\"\",\"name\":\"Couples-ed630337b1ee\"},\"widget\":\"CouplesContainer\"}",
                "type": "CouplesContainer",
                "group": "Actividades gamificadas",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget parejas [Pablo]",
                "description": "Ejemplo de parejas",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:14:51Z",
                "updatedAt": "2023-07-18T10:54:14Z"
            },
            {
                "id": 48,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"f535f5194255\",\"data\":{\"alt\":\"Una conversación en inglés entre John y Laura.\",\"blob\":\"\",\"image\":\"https://multimediarepository.blob.core.windows.net/imagecontainer/170646c737764ffab992938b2c9698f1.png\",\"pieces\":[{\"h\":\"103.1723237597912\",\"w\":\"180.3655352480418\",\"x\":\"16.344647519582246\",\"y\":\"31.148825065274163\",\"altImg\":\"Hello! What's your name?\",\"altRec\":\"Saludo inicial\"},{\"h\":\"76.73629242819842\",\"w\":\"153.9295039164491\",\"x\":\"200.33942558746728\",\"y\":\"25.861618798955575\",\"altImg\":\"My name is John\",\"altRec\":\"Primera respuesta a Laura\"},{\"h\":\"84.13838120104441\",\"w\":\"214.2036553524804\",\"x\":\"275.4177545691906\",\"y\":\"105.16971279373368\",\"altImg\":\"Nice to meet you too\",\"altRec\":\"Última respuesta a Laura\"}]},\"params\":{\"help\":\"\",\"name\":\"Puzzle-f535f5194255\"},\"widget\":\"Puzzle\"}",
                "type": "Puzzle",
                "group": "Actividades gamificadas",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget rompecabezas [Pablo]",
                "description": "Ejemplo de rompecabezas",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:15:17Z",
                "updatedAt": "2023-07-18T10:54:04Z"
            },
            {
                "id": 49,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"0a0e239d6493\",\"data\":{\"rows\":[{\"Nombre\":\"Coche\",\"Cantidad\":\"10\",\"Identificador\":\"1\"},{\"Nombre\":\"Rueda\",\"Cantidad\":\"2000\",\"Identificador\":\"2\"},{\"Nombre\":\"Zapato\",\"Cantidad\":\"5000\",\"Identificador\":\"3\"}],\"columns\":[\"Identificador\",\"Nombre\",\"Cantidad\"]},\"params\":{\"help\":\"\",\"name\":\"Table-0a0e239d6493\"},\"widget\":\"Table\"}",
                "type": "Table",
                "group": "Contenido didáctico",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget tabla [Pablo]",
                "description": "Ejemplo de tabla",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:15:50Z",
                "updatedAt": "2023-07-18T10:53:43Z"
            },
            {
                "id": 50,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"728ea159f59d\",\"data\":[{\"id\":\"34f83a5a7a27\",\"data\":{\"url\":\"\",\"current\":true},\"params\":{\"help\":\"Una única entrada, y es la actual\",\"name\":\"Table Entry-34f83a5a7a27\"},\"widget\":\"RelatedUnitsItem\"}],\"params\":{\"help\":\"\",\"name\":\"Table Content-728ea159f59d\"},\"widget\":\"RelatedUnitsContainer\"}",
                "type": "RelatedUnitsContainer",
                "group": "Índice de contenido",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget tabla de contenido [Pablo]",
                "description": "Ejemplo de tabla de contenido",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:16:08Z",
                "updatedAt": "2023-07-18T10:53:27Z"
            },
            {
                "id": 51,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"0350adae9697\",\"data\":[{\"id\":\"15e65acab019\",\"data\":{\"answers\":[{\"text\":\"INDIe partner\",\"correct\":false},{\"text\":\"INDIe4All partner\",\"correct\":true},{\"text\":\"INDIe and INDIe4All coordinator\",\"correct\":false}],\"feedback\":{\"negative\":\"\",\"positive\":\"\"},\"question\":\"ChildVision is a\"},\"widget\":\"SimpleQuestion\"},{\"id\":\"51380dd784b9\",\"data\":{\"answers\":[{\"text\":\"INDIe partner\",\"correct\":true},{\"text\":\"INDIe4All partner\",\"correct\":false},{\"text\":\"INDIe and INDIe4All coordinator\",\"correct\":false}],\"feedback\":{\"negative\":\"\",\"positive\":\"\"},\"question\":\"Kauno Kolegija is a\"},\"widget\":\"SimpleQuestion\"},{\"id\":\"4b96c5978184\",\"data\":{\"answers\":[{\"text\":\"INDIe partner\",\"correct\":false},{\"text\":\"INDIe4All partner\",\"correct\":false},{\"text\":\"INDIe and INDIe4All coordinator\",\"correct\":true}],\"feedback\":{\"negative\":\"\",\"positive\":\"\"},\"question\":\"Universidad Politécnica de Cartagena is a\"},\"widget\":\"SimpleQuestion\"}],\"params\":{\"help\":\"\",\"name\":\"Test-0350adae9697\"},\"widget\":\"Test\"}",
                "type": "Test",
                "group": "Preguntas de evaluación",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget tipo test [Pablo]",
                "description": "Ejemplo de tipo test",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:16:43Z",
                "updatedAt": "2023-07-18T10:53:03Z"
            },
            {
                "id": 52,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"d41382d97689\",\"data\":[[{\"id\":\"ad2e61477d1d\",\"data\":{\"text\":\"<p>Columna 1</p>\"},\"widget\":\"TextBlock\"}],[{\"id\":\"8256bf53d5e4\",\"data\":{\"text\":\"<p>Columna 2</p>\"},\"widget\":\"TextBlock\"}],[{\"id\":\"7aca5fe50503\",\"data\":{\"text\":\"<p>Columna 3</p>\"},\"widget\":\"TextBlock\"}]],\"widget\":\"ThreeColumnsLayout\"}",
                "type": "ThreeColumnsLayout",
                "group": "Contenido didáctico",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de tres columnas [Pablo]",
                "description": "Ejemplo de widget de tres columnas",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:17:03Z",
                "updatedAt": "2023-07-18T10:52:53Z"
            },
            {
                "id": 53,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"341933cff955\",\"data\":[{\"id\":\"e720067495a9\",\"data\":{\"text\":\"<p>The objective of INDIe is to <strong>empower teachers</strong> so that they can deliver high quality teaching and help them adopting new learning methodologies: flipped classroom, blended learning, adaptive learning, etc…, which are student centred and seek to ensure that learners are engaged and drive their individual learning experience. As an output of the project, a number of teachers/authors will have created digital contents, used them in class, and published them in the repository for others teachers to use, but, more importantly, the structure will be set up, at a regional level, for the regional authorities for education to promote a much wider use of the platform within the community of teachers and schools, by launching official calls for training and creating digital contents.</p>\"},\"widget\":\"TextBlock\"}],\"params\":{\"help\":\"\",\"name\":\"Modal-341933cff955\",\"text\":\"INDIe objective\"},\"widget\":\"Modal\"}",
                "type": "Modal",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de ventana modal [Pablo]",
                "description": "Ejemplo de ventana modal",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:19:29Z",
                "updatedAt": "2023-07-18T10:52:35Z"
            },
            {
                "id": 54,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"9d401bd095e0\",\"data\":[{\"id\":\"1dbd6f9cbd2e\",\"data\":{\"answer\":true,\"feedback\":{\"negative\":\"Tienes un grave problema.\",\"positive\":\"¡Muy bien! Sabes sumar.\"},\"question\":\"¿Dos más dos son cuatro?\"},\"widget\":\"TrueFalseItem\"},{\"id\":\"34c45656dea0\",\"data\":{\"answer\":true,\"feedback\":{\"negative\":\"\",\"positive\":\"\"},\"question\":\"El antónimo de blanco es negro\"},\"widget\":\"TrueFalseItem\"}],\"params\":{\"help\":\"\",\"name\":\"True false-9d401bd095e0\"},\"widget\":\"TrueFalseContainer\"}",
                "type": "TrueFalseContainer",
                "group": "Preguntas de evaluación",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de Verdadero/Falso [Pablo]",
                "description": "Ejemplo de Verdadero/Falso",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:19:51Z",
                "updatedAt": "2023-07-18T10:52:22Z"
            },
            {
                "id": 55,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"9f23aaa70f53\",\"data\":{\"captions\":\"\",\"videourl\":\"https://www.youtube.com/watch?v=HlZIpqnfMIY\",\"descriptions\":\"\",\"defaultCaptions\":\"1\"},\"params\":{\"name\":\"Video-9f23aaa70f53\"},\"widget\":\"Video\"}",
                "type": "Video",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de vídeo [Pablo]",
                "description": "Ejemplo de vídeo",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:20:13Z",
                "updatedAt": "2023-07-18T10:52:09Z"
            },
            {
                "id": 56,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"724b04381668\",\"data\":{\"videourl\":\"https://scgateway-cpcd-upct-gufcfdgzgee5fydr.z01.azurefd.net/api/indieopen/video/embed/1a8e2f6cee88458f95c5d733134ed971?origin=indieopen\"},\"params\":{\"name\":\"Interactive Video-724b04381668\"},\"widget\":\"InteractiveVideo\"}",
                "type": "InteractiveVideo",
                "group": "Contenido interactivo",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Widget de vídeo interactivo [Pablo]",
                "description": "Ejemplo de vídeo interactivo",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-06T11:20:31Z",
                "updatedAt": "2023-07-18T10:52:01Z"
            }
        ]);
    }
}