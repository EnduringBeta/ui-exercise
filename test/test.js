var assert = require("assert");
var emails = require("../emails.js");

describe("parseJson", function() {
    describe("success", function() {
        it("should return valid object from JSON string", function() {
            var jsonStr = "{\"messages\": [{ \
                \"id\": \"1\", \
                \"subject\": \"Hello\", \
                \"sender\": \"bob.smith@gmail.com\", \
                \"body\": \"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia vestibulum eros, a aliquet odio fermentum et. Fusce in volutpat est, eu aliquam ante. Integer at sapien sit amet nisl venenatis ullamcorper eu sed magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a odio vitae risus dictum pellentesque in vehicula leo. Nam massa sem, pretium at lacus quis, aliquam facilisis odio. Maecenas risus purus, dapibus sed viverra a, efficitur eget leo. Integer quis magna id ante ornare euismod. Nunc aliquet arcu sit amet tincidunt feugiat. Ut et sapien ut leo blandit egestas a non arcu.</p><p>Sed finibus rhoncus nulla, eu molestie urna volutpat non. Etiam molestie faucibus nisi eget molestie. Vestibulum porta a leo a scelerisque. Mauris eget nisl sapien. Aliquam consectetur sed massa eget accumsan. Pellentesque eget arcu quam. Vivamus feugiat lacinia laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed quis quam vitae lorem rhoncus viverra vel et dolor. Sed pharetra cursus risus sit amet accumsan.</p>\", \
                \"tags\": [\"work\"], \
                \"date\": \"2017-03-05T03:25:43.511Z\" \
            }]}"
            var res = emails.parseJson(jsonStr);
            var compare = {
                "messages": [{
                    "id": "1",
                    "subject": "Hello",
                    "sender": "bob.smith@gmail.com",
                    "body": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia vestibulum eros, a aliquet odio fermentum et. Fusce in volutpat est, eu aliquam ante. Integer at sapien sit amet nisl venenatis ullamcorper eu sed magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a odio vitae risus dictum pellentesque in vehicula leo. Nam massa sem, pretium at lacus quis, aliquam facilisis odio. Maecenas risus purus, dapibus sed viverra a, efficitur eget leo. Integer quis magna id ante ornare euismod. Nunc aliquet arcu sit amet tincidunt feugiat. Ut et sapien ut leo blandit egestas a non arcu.</p><p>Sed finibus rhoncus nulla, eu molestie urna volutpat non. Etiam molestie faucibus nisi eget molestie. Vestibulum porta a leo a scelerisque. Mauris eget nisl sapien. Aliquam consectetur sed massa eget accumsan. Pellentesque eget arcu quam. Vivamus feugiat lacinia laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed quis quam vitae lorem rhoncus viverra vel et dolor. Sed pharetra cursus risus sit amet accumsan.</p>",
                    "tags": ["work"],
                    "date": "2017-03-05T03:25:43.511Z"
                }]
            };
            assert.equal(res.messages[0].id, compare.messages[0].id);
        });
    });
    describe("failure", function() {
        it("should handle improper JSON format gracefully", function() {
            var jsonStr = "{a}";
            var res = emails.parseJson(jsonStr);
            assert.equal(res, "Error: invalid JSON format!");
        });
    });
});
