import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import Speech from 'speak-tts';
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    public collapedSideBar: boolean;
    public speech = new Speech();
    public talk: boolean = false;
    constructor() { }

    ngOnInit() {
        // chat bot
        this.speech.init({
            'volume': 1,
            'lang': 'en-GB',
            'rate': 1,
            'pitch': 1,
            'voice': 'Google UK English Female',
            'splitSentences': true,
            'listeners': {
                'onvoiceschanged': (voices) => {
                }
            }
        })
        const _this = this;
        if (document.getElementById("kommunicate-widget-iframe")) {
            (window as any).Kommunicate && (window as any).Kommunicate.logout();
        }
        var logindetails = JSON.parse(localStorage.LoggedinUser);
        var userid = logindetails.UserEmail + "tru";
        var email = logindetails.UserEmail;
        var name = logindetails.Firstname;
        (function (d, m) {
            var defaultSettings = {
                "defaultBotIds": ["hel-jkzmu"],
                "defaultAssignee": "hel-jkzmu",
                "skipRouting": true
            };
            var kommunicateSettings = {
                "userId": userid,
                "email": email,
                "displayName": name,
                "appId": "27fd28945715dda512697e4a2cbcb9666",
                "sessionTimeout": 86400000,
                "popupWidget": true,
                "automaticChatOpenOnNavigation": false,
                "locShare": true,
                "emojilibrary": true,
                "voiceInput": true,
                "onInit": function () {
                    (window as any).Kommunicate.updateSettings(defaultSettings);
                    var events = {
                        'onMessageReceived': function (resp) {
                            if (_this.talk && resp.message.message && resp.message.message != "TRU created group Conversations" && resp.message.message != "TRU updated group metadata" && resp.message.message != "Assigned to TRU" && resp.message.message.length < 400) {
                                if (resp.message.message == 'support@trurealty.in') {
                                    resp.message.message = 'support at the rate trurealty dot in';
                                }
                                _this.speech.speak({
                                    text: resp.message.message
                                });
                            }
                        },
                        'onMessageSent': function (resp) {
                        }
                    };
                    (window as any).Kommunicate.subscribeToEvents(events);
                }
            };
            var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
            (window as any).kommunicate = m; m._globals = kommunicateSettings;
        })(document, (window as any).kommunicate || {});
        setTimeout(function () {
            interval(300).subscribe(x => {
                if ((window as any).KommunicateGlobal) {
                    if ((window as any).KommunicateGlobal.document.getElementById('mck-sidebox') && document.getElementById('speaker') != null) {
                        if ((window as any).KommunicateGlobal.document.getElementById('mck-sidebox').style.display == 'none' || (window as any).KommunicateGlobal.document.getElementById('mck-sidebox').style.display == '') {
                            document.getElementById('speaker').style.display = 'none';
                        }
                        else {
                            document.getElementById('speaker').style.display = 'block';
                        }
                    }
                }

            });
        }, 5000);
        // end
    }

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
    // sound button on
    speakerOn() {
        this.talk = false;
        this.speech.cancel()
        document.getElementById('soundon').style.display = 'none';
        document.getElementById('soundoff').style.display = 'block';
    }
    // sound button off
    speakerOff() {
        this.talk = true;
        document.getElementById('soundoff').style.display = 'none';
        document.getElementById('soundon').style.display = 'block';
    }
}
