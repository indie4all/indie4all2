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

        const widget2 = {
            name: "Widget AAAAAA",
            description: "This is a template widget for test purposes only",
            author: { completeName: "Javier" },
            grupo: "grupo1",
            type: "TextBlock",
            content: JSON.stringify(obj)
        }

        json.push(widget2);

        res.send([
            {
                "id": 91,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"b04561751828\",\"data\":{\"text\":\"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lorem metus, accumsan et ultricies consequat, convallis in sapien. Integer sit amet scelerisque ligula. Duis venenatis, nunc vitae porta viverra, metus est condimentum risus, at semper ex sapien id quam. Praesent elementum, ex ut elementum scelerisque, lectus odio rhoncus est, quis porta libero metus vitae dui. Phasellus accumsan cursus erat in vestibulum. Nunc sit amet eros neque. Nullam ut volutpat dui. In tempor ultricies ex quis tincidunt. Quisque ipsum eros, venenatis non magna a, suscipit eleifend eros. Ut a diam dolor. Maecenas condimentum iaculis fermentum.\\n</p><p>Nam ac est nisi. Integer dignissim blandit augue nec convallis. Nam et metus quis urna feugiat tincidunt ut vel diam. Vestibulum porta nunc tincidunt ipsum egestas iaculis. Maecenas commodo nisi vitae risus maximus, in ullamcorper ligula porttitor. Suspendisse suscipit nunc vitae lorem pulvinar, ut laoreet arcu porta. Morbi massa libero, ultricies quis massa non, aliquam placerat enim. Nunc vitae venenatis risus. Nulla congue nulla sed aliquam aliquet. Phasellus nec pulvinar justo.\\n</p><p>Proin dignissim, augue vitae posuere egestas, ante nulla luctus neque, sed imperdiet elit nibh eu erat. Nulla eu lacus sapien. Aliquam sodales sollicitudin orci ac congue. Proin est diam, viverra sed neque ut, convallis dapibus nisi. Nullam congue ut enim vel finibus. Duis efficitur sem nisi, sit amet pharetra nunc sodales vitae. Suspendisse ut orci viverra, ullamcorper mi a, tempus sapien. Curabitur vitae odio et libero sodales rutrum. Vivamus iaculis ullamcorper molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec lacinia mi vitae orci varius laoreet. In hac habitasse platea dictumst.\\n</p><p>Fusce ut mauris consequat, sollicitudin eros at, porta dui. Suspendisse suscipit erat accumsan orci placerat, eget egestas ipsum lacinia. Nulla facilisis id lorem in vestibulum. Integer eget nisl in mi porttitor facilisis vel a nisl. Donec tincidunt nibh at accumsan faucibus. In tincidunt dignissim risus eu vulputate. Aliquam elementum vitae massa at tristique. Duis vulputate nunc non neque malesuada, id ullamcorper neque placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse vel pulvinar felis, et auctor turpis. Proin augue eros, lacinia a neque eget, varius faucibus nulla. Pellentesque venenatis odio quis venenatis venenatis. Nullam convallis purus sed bibendum fringilla. Duis mattis fringilla dignissim.\\n</p><p>In eleifend elementum sem, at condimentum enim sagittis et. Aliquam luctus fermentum felis eu rutrum. Praesent eu ultrices justo. Sed placerat fermentum ligula eu faucibus. In sit amet lacus orci. Aenean dapibus condimentum consectetur. Aenean sed molestie enim. Sed rhoncus nunc eget enim sodales, a aliquet nibh auctor. Curabitur tellus est, convallis eu efficitur vitae, rhoncus mattis elit. Suspendisse suscipit vulputate magna, eget ultricies urna luctus tincidunt. Nullam vitae mattis magna. Sed in sodales velit. Maecenas facilisis, justo porta dignissim iaculis, nulla mauris pretium elit, ac fermentum lectus erat ac dui. Nulla facilisi. Cras gravida enim quis pretium tempus. Aliquam consequat, enim sit amet fermentum aliquam, lacus elit vestibulum mi, nec laoreet nisl magna quis lectus.</p>\",\"style\":\"default\"},\"widget\":\"TextBlock\"}",
                "type": "TextBlock",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Lorem ipsum text",
                "description": "Generated Lorem Ipsum text",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-25T06:14:09Z",
                "updatedAt": "2023-09-01T06:31:26Z"
            },
            {
                "id": 92,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"cad04dce940c\",\"data\":{\"text\":\"<p>Text en català per traduir.</p>\",\"style\":\"default\"},\"widget\":\"TextBlock\"}",
                "type": "TextBlock",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "CA",
                "name": "Widget en catalán",
                "description": "Text",
                "tags": [],
                "originalWidgetStamp": null,
                "createdAt": "2023-07-28T05:12:07Z",
                "updatedAt": "2023-07-28T05:12:46Z"
            },
            {
                "id": 93,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"c11b300cabea\",\"data\":[{\"id\":\"0c188d2a132b\",\"data\":{\"answers\":[{\"text\":\"Sí\",\"correct\":true},{\"text\":\"No\",\"correct\":false}],\"feedback\":{\"negative\":\"\",\"positive\":\"\"},\"question\":\" Prueba \"},\"widget\":\"SimpleQuestion\"},{\"id\":\"278b3b42fe2f\",\"data\":{\"answers\":[{\"text\":\"OK\",\"correct\":true},{\"text\":\"NO\",\"correct\":false}],\"feedback\":{\"negative\":\"\",\"positive\":\"\"},\"question\":\" Hola mundo \\\"ok\\\" \"},\"widget\":\"SimpleQuestion\"},{\"id\":\"77658e19b299\",\"data\":{\"answers\":[{\"text\":\"OK\",\"correct\":true},{\"text\":\"ERROR\",\"correct\":false},{\"text\":\"BIEN\",\"correct\":true}],\"feedback\":{\"negative\":\"\",\"positive\":\"\"},\"question\":\" Pregunta de prueba múltiple \"},\"widget\":\"MultipleQuestion\"}],\"params\":{\"help\":\"\",\"name\":\"Test-c11b300cabea\"},\"widget\":\"Test\"}",
                "type": "Test",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "EN",
                "name": "Test",
                "description": "asd",
                "tags": [
                    "nueva",
                    "etiqueta",
                    "bien"
                ],
                "originalWidgetStamp": null,
                "createdAt": "2023-09-06T10:15:00Z",
                "updatedAt": "2023-09-06T10:15:19Z"
            },
            {
                "id": 95,
                "author": {
                    "id": "402881a17dcdcdf1017dcdcfd2300001",
                    "completeName": "Pablo David Muñoz Sánchez",
                    "email": "pablodavid.munoz@gmail.com",
                    "institution": "INDIe4All",
                    "country": "Spain"
                },
                "content": "{\"id\":\"a41ff74cfc36\",\"data\":[{\"id\":\"e3bb7c6b5bbf\",\"data\":[{\"id\":\"1db7137bfb53\",\"data\":{\"text\":\"<p>B</p>\"},\"widget\":\"TextBlock\"}],\"params\":{\"title\":\"A\"},\"widget\":\"AcordionContent\"}],\"params\":{\"help\":\"\",\"name\":\"Acordion-a41ff74cfc36\"},\"widget\":\"AcordionContainer\"}",
                "type": "AcordionContainer",
                "mode": "ORIGINAL",
                "creativeCommons": "PRIVATE",
                "language": "BG",
                "name": "grupal2345",
                "description": "Mentira",
                "tags": [
                    "etiqueta",
                    "prueba"
                ],
                "originalWidgetStamp": null,
                "createdAt": "2023-09-25T07:07:52Z",
                "updatedAt": "2023-09-25T07:41:25Z"
            }
        ]);
    }
}