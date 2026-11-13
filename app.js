let config={theme:'',font:'system-ui, sans-serif',focus:false,blurWrite:false,dyslexia:false,ruler:false,eatToRead:true,autism:false,mood:true,highlightColon:true,highlightComma:true,highlightNumbers:true,highlightMentions:true,previewEditable:false,calloutDot:false,useStudyTimer:true,useXp:false,useTasks:false,useTts:false,anchor:false,anchorLevel:'.5',readWpm:250,readMode:'guide',useReader:true,mapAutoNext:false,syncScroll:true,mapShape:'rect',mapCurve:'basis',mapPalette:'accent',mapColorMode:'branch',mapLine:2,mapFont:15,mapSpace:'normal',mapArrows:'on',mapMerge:'on'};
let mapDirection='TD',renderTimeout,blurTimer,studyTimerInterval,timeRemaining=1500,xp=0,level=1,mapZoom=1,mapPanX=0,mapPanY=0,mapBaseViewBox=null,mapBoundsSvg=null,printMapState=null,previewEditing=false,previewDirty=false,previewInputTimer;
const $=id=>document.getElementById(id);
const LANGUAGE_KEY='nn_language_v1';
const EDITOR_HINT_EN=`Start writing your notes...

✨ Highlight syntax:
Text:: Your text here up to the period.

Text markers:
• !!! Important
• ??? Question
• i! Note
• Difficult sentence === Easier sentence

Mind map syntax:
• Concept A >> Concept B >> Concept C
• to branch from B, write anywhere: B >> C`;
let italianEditorHint='';
const EN={
'⚙ Configurazione Interfaccia':'⚙ Interface settings','🎨 Stile & UI':'🎨 Style & interface','Lingua / Language':'Language','Tema Colori':'Color theme','Scuro (Default)':'Dark (default)','Sci-Fi (Cyber)':'Sci-Fi (Cyber)','Notte (Blu scuro)':'Night (dark blue)','Foresta (Verde)':'Forest (green)','Seppia (Caldo)':'Sepia (warm)','Chiaro':'Light','Font Appunti':'Notes font','Sans serif di sistema':'System sans serif','Serif di sistema':'System serif','Monospace di sistema':'System monospace','🗺 Personalizzazione Mappa':'🗺 Mind map customization','↺ Ripristina mappa':'↺ Reset map','⚡ Lettura ad ancore & Veloce':'⚡ Anchor & speed reading','ℹ️ Come funzionano':'ℹ️ How it works','Licenze e uso offline':'Licenses & offline use','Salva e Chiudi':'Save and close',
'Mermaid 10.9.8, usato per generare le mappe, è distribuito con licenza MIT e copyright © 2014–2022 Knut Sveidqvist. Il testo completo della licenza è riportato qui sotto.':'Mermaid 10.9.8, used to generate maps, is distributed under the MIT License, copyright © 2014–2022 Knut Sveidqvist. The full license text appears below.',
"L'app funziona offline: script e caratteri utilizzati sono inclusi o già disponibili sul dispositivo. Non invia richieste in rete e non trasmette le note a un server.":'The app works offline: its scripts and fonts are bundled or already available on your device. It makes no network requests and does not send your notes to a server.',
'Le note e le impostazioni sono conservate localmente nel browser o nel profilo dell\'app. Non sono cifrate automaticamente: proteggi l\'account del dispositivo e esporta in .txt le note importanti.':'Your notes and settings are stored locally in the browser or app profile. They are not encrypted automatically: protect your device account and export important notes to .txt.',
'Le note e le impostazioni sono conservate localmente nel browser o nel profilo dell’app. Non sono cifrate automaticamente: proteggi l’account del dispositivo e esporta in .txt le note importanti.':'Your notes and settings are stored locally in the browser or app profile. They are not encrypted automatically: protect your device account and export important notes to .txt.',
'Note-all-in-one è distribuito con licenza GNU GPL versione 3 o successive.':'Note-all-in-one is distributed under the GNU GPL version 3 or later.',
'Licenza MIT completa (Mermaid)':'Full MIT License (Mermaid)',
'Lettura ad ancore:':'Anchor reading:','mette in grassetto una parte iniziale di ogni parola per creare un diverso contrasto visivo. Non modifica il testo salvato e non è dimostrato che faccia leggere più velocemente: usala se personalmente ti risulta più comoda.':'bolds the beginning of each word to create a different visual contrast. It does not change saved text, and it has not been shown to make people read faster. Use it if it feels more comfortable for you.',
'Guida nel testo:':'Guided reading:','evidenzia una parola alla volta mantenendola nel suo contesto e scorre automaticamente. La velocità è espressa in parole al minuto; la pausa si adatta alla lunghezza della parola e alla punteggiatura.':'highlights one word at a time in context and scrolls automatically. Speed is measured in words per minute; pauses adapt to word length and punctuation.',
'Una parola alla volta (RSVP):':'One word at a time (RSVP):','presenta ogni parola in un punto fisso, con una lettera centrale evidenziata. Riduce i movimenti oculari, ma mostra meno contesto: scegli la modalità e la velocità che ti aiutano a capire, non solo a scorrere.':'shows each word in a fixed position, highlighting a central letter. It reduces eye movement but provides less context: choose the mode and speed that help you understand, not just move faster.',
'Audio:':'Audio:','la lettura veloce è solo visiva, non parla. Per ascoltare la voce del browser, attiva “Pulsante Leggi ad alta voce” nelle impostazioni e poi premi 🔊 Leggi.':'speed reading is visual and does not speak. To hear your browser read aloud, enable “Read aloud button” in settings, then press 🔊 Read.',
'Tasti:':'Keys:','Spazio = avvia/pausa · ← → = una parola · ↑ ↓ = velocità. I tasti non interferiscono con i campi di testo o con i controlli.':'Space = play/pause · ← → = one word · ↑ ↓ = speed. These shortcuts do not interfere with text fields or controls.',
'Ricerca:':'Research:','un esperimento sulla lettura con inizio parola in grassetto non ha trovato un vantaggio generale di velocità; le preferenze individuali possono comunque variare. Anche la presentazione RSVP non è equivalente alla lettura normale: aumenta gradualmente la velocità e fai pause se cala la comprensione. Riferimenti (testo non cliccabile): Snell (2024), Acta Psychologica, DOI 10.1016/j.actpsy.2024.104304 · Benedetto et al. (2015), RSVP, DOI 10.1016/j.chb.2014.12.043.':'A study of bold-beginning reading found no general speed benefit, though individual preferences may vary. RSVP is also different from normal reading: increase speed gradually and pause if comprehension drops. References (plain text): Snell (2024), Acta Psychologica, DOI 10.1016/j.actpsy.2024.104304 · Benedetto et al. (2015), RSVP, DOI 10.1016/j.chb.2014.12.043.',
'📁 Note & Salvataggio':'📁 Notes & storage','📚 Le mie note':'📚 My notes','＋ Nuova':'＋ New','📤 Esporta':'📤 Export','📄 Testo (.txt)':'📄 Text (.txt)','🖨 PDF stampabile':'🖨 Printable PDF','📦 Backup completo (.json)':'📦 Full backup (.json)','📥 Importa':'📥 Import','➕ Aggiungi note da file (.json / .txt)':'➕ Add notes from file (.json / .txt)','♻ Sostituisci tutto da backup':'♻ Replace everything from backup','⚙ Setup':'⚙ Settings','👓 Ancore':'👓 Anchors','⏩ Lettura veloce':'⏩ Speed reading','🔊 Leggi':'🔊 Read aloud','🖼 Salva Mappa':'🖼 Save map','🌫 Focus Blur':'🌫 Focus blur','🗑 Pulisci':'🗑 Clear','📝 Modifica':'📝 Edit','📖 Anteprima':'📖 Preview','🗺 Mappa':'🗺 Map','⑂ 2 frecce':'⑂ 2 branches','↕ Vert':'↕ Vertical','↔ Oriz':'↔ Horizontal','🎯 Micro-Task':'🎯 Micro-tasks','Dividi per vincere':'Break it down to succeed','parole/min':'words/min','Cerca nelle note...':'Search notes...','Aggiungi piccolo step e premi Invio...':'Add a small step and press Enter...','Inizia a scrivere i tuoi appunti...\\n\\n✨ Sintassi Evidenziatore:\\nTesto:: Il tuo testo qui fino al punto.\\n\\nSintassi testuali:\\n• !!! Importante\\n• ??? Dubbio\\n• i! Nota\\n• Frase difficile === Frase facile\\n\\nSintassi mappa:\\n• Concetto A >> Concetto B >> Concetto C\\n• per collegare altro a B scrivi, dove vuoi: B >> C':'Start writing your notes...\\n\\n✨ Highlight syntax:\\nText:: Your text here up to the period.\\n\\nText markers:\\n• !!! Important\\n• ??? Question\\n• i! Note\\n• Difficult sentence === Easier sentence\\n\\nMind map syntax:\\n• Concept A >> Concept B >> Concept C\\n• to branch from B, write anywhere: B >> C',
'Timer di studio (Gestione Tempo)':'Study timer (time management)','Sistema Livelli ed XP':'Levels and XP','Widget Micro-Task (Scomposizione attività)':'Micro-task widget (break down tasks)','Pulsante Leggi ad alta voce (voce del browser)':'Read aloud button (browser voice)','Modalità Alta Leggibilità':'High readability mode','Righello Visivo Sincronizzato':'Synchronized reading ruler','Modalità Focus (Nasconde anteprime)':'Focus mode (hides previews)','Scrittura Libera (Sfoca testo passato)':'Free writing (blur previous text)','Semplificazione Testo (Sintassi ===)':'Simplify text (=== syntax)','Scorrimento sincronizzato Editor/Anteprima':'Sync editor and preview scrolling','Lettura ad ancore (prime lettere in grassetto)':'Anchor reading (bold beginnings)','Lettura Veloce (pulsante e barra di lettura)':'Speed reading (button and reader bar)','Mappa (facoltativo): Invio dopo "a &gt;&gt; b" propone "b &gt;&gt; "':'Map (optional): Enter after "a &gt;&gt; b" suggests "b &gt;&gt; "','Riduzione Distrazioni Visive (Niente animazioni)':'Reduce visual distractions (no animations)','Stato nodo: :) = sì, capito; :( = argomento non capito (a fine frase)':'Map status: :) = understood; :( = not understood (at the end of a line)','Forma nodi':'Node shape','Rettangolo':'Rectangle','Arrotondato':'Rounded','Pillola':'Pill','Esagono':'Hexagon','Cerchio':'Circle','Stile linee':'Line style','Curve':'Curved','Dritte':'Straight','A gradini':'Stepped','Colori nodi':'Node colors','Colore del tema':'Theme color','Vivace':'Vivid','Pastello':'Pastel','Monocromatico':'Monochrome','Colora per':'Color by','Ramo (riga)':'Branch (line)','Livello':'Level','Tutti uguali':'All the same','Spessore linee':'Line thickness','Sottile':'Thin','Normale':'Normal','Spesso':'Thick','Testo nodi':'Node text','Piccolo':'Small','Grande':'Large','Molto grande':'Very large','Spaziatura':'Spacing','Compatta':'Compact','Ampia':'Wide','Frecce':'Arrows','Sì':'Yes','No':'No','Parole uguali':'Matching words','Unisci in un nodo':'Merge into one node','Tieni separate':'Keep separate','Intensità ancore':'Anchor intensity','Leggera (30%)':'Light (30%)','Media (50%)':'Medium (50%)','Forte (65%)':'Strong (65%)','Modalità lettura veloce':'Speed-reading mode','Guida nel testo':'Guided reading','Una parola alla volta (RSVP)':'One word at a time (RSVP)','Capito':'Understood','Non capito':'Not understood','✓ Capito':'✓ Understood','⚠ Non capito':'⚠ Not understood','Importante':'Important','Dubbio':'Question','Nota':'Note','Semplificazioni':'Simplifications','Usa la sintassi:<br>• Concetto A &gt;&gt; Concetto B<br>• per collegare altro a B scrivi, dove vuoi: B &gt;&gt; C':'Use this syntax:<br>• Concept A &gt;&gt; Concept B<br>• to branch from B, write anywhere: B &gt;&gt; C',
'Parole':'Words','parole':'words','note':'notes','salvate in automatico su questo browser':'saved automatically in this browser','Livello':'Level','salvato':'saved','salvataggio':'saving','memoria piena: esporta in .txt ed elimina note vecchie':'storage full: export to .txt and delete old notes','Nessuna nota trovata.':'No notes found.','note · salvate in automatico su questo browser':'notes · saved automatically in this browser','Rinomina':'Rename','Duplica':'Duplicate','Elimina':'Delete','Senza titolo':'Untitled','Nuova nota':'New note','(copia)':'(copy)','Salvato':'Saved','La nota è vuota':'The note is empty','TXT scaricato':'TXT downloaded','Backup scaricato':'Backup downloaded','File non valido':'Invalid file','note aggiunte':'notes added','Backup ripristinato':'Backup restored','Duplicata':'Duplicated','Tempo scaduto!':'Time is up!','Vuoi cancellare tutto il testo?':'Do you want to clear all text?','Nessuna mappa generata da salvare!':'There is no map to save!',"L'area degli appunti è vuota!":'The notes area is empty!','Nuovo titolo (lascia vuoto per il titolo automatico):':'New title (leave blank for an automatic title):','Eliminare':'Delete','Non si può annullare.':'This cannot be undone.','Sostituire TUTTE le note e le impostazioni con quelle del backup?':'Replace ALL notes and settings with the backup?','Avvia la lettura':'Start reading','Metti in pausa la lettura':'Pause reading','Semplificato:':'Simplified:','📄 TXT scaricato':'📄 TXT downloaded','📦 Backup scaricato':'📦 Backup downloaded','Aggiungi note da file':'Add notes from file','Riferimenti':'References','🎯 Motivazione & Produttività':'🎯 Motivation & productivity','📖 Focus & Leggibilità':'📖 Focus & readability','🧩 Accessibilità & Comfort Visivo':'🧩 Accessibility & visual comfort','Pulisci':'Clear','Note ed esportazione':'Notes and export','Studio':'Study','Pausa':'Break','Stop':'Stop','Cancella tutto':'Clear everything','Ingrandisci mappa':'Zoom in','Rimpicciolisci mappa':'Zoom out','Ripristina dimensione':'Reset size','Inserisci una parola con 2 frecce':'Insert a word with 2 branches','Avvia / Pausa':'Play / pause','Indietro di 10 parole':'Back 10 words','Avanti di 10 parole':'Forward 10 words','Più lento':'Slower','Più veloce':'Faster','Riduci velocità':'Decrease speed','Aumenta velocità':'Increase speed','Posizione di lettura':'Reading position',"Ferma e riparti dall'inizio":'Stop and restart from the beginning','Velocità di lettura':'Reading speed','Salva mappa':'Save map','File salvato!':'File saved!','Mappa salvata!':'Map saved!','ora ha 2 frecce':'now has 2 branches','Parola':'Word','Usa la sintassi':'Use this syntax','Lettura ad ancore':'Anchor reading','Lettura veloce con guida':'Guided speed reading','Salva Mappa':'Save map','Focus Blur':'Focus blur','Evidenziatore':'highlighter','Nota, Importante, Dubbio':'Note, Important, Question','Carica':'Load','Seleziona':'Select','Non è possibile annullare.':'This cannot be undone.','Idea 1':'Idea 1','Idea 2':'Idea 2','Il diagramma restituito non è un SVG valido.':'The generated diagram is not a valid SVG.','🎉 LIVELLO UP!':'🎉 LEVEL UP!','Avvia o metti in pausa la lettura':'Play or pause reading'
};
Object.assign(EN,{
'🧩 Marcatori e testo':'🧩 Text markers & display',
'Queste opzioni cambiano solo l\'anteprima: il blocco appunti a sinistra resta la fonte della mappa e del salvataggio.':'These options affect only the preview: the notes editor on the left remains the source for the map and saved notes.',
'Le evidenziazioni e le modifiche all’anteprima non cambiano gli appunti originali. Lo stato :) / :( può comparire anche nella mappa; gli appunti a sinistra restano la fonte del testo salvato e della mappa.':'Highlights and preview edits do not change the original notes. The :) / :( status can also appear in the map; the notes on the left remain the source for saved text and the map.',
'Evidenzia testo dopo ::':'Highlight text after ::',
'Evidenzia in modo discreto il testo dopo ,,':'Subtly highlight text after ,,',
'Evidenzia i numeri degli elenchi (1), 2), 10)…)':'Highlight numbered list markers (1), 2), 10)…',
'Evidenzia le menzioni che iniziano con @':'Highlight mentions starting with @',
'Riconosci :) e :( come stato del nodo':'Show :) and :( as map status',
'Rendi modificabile l’anteprima a destra':'Make the preview on the right editable',
'Modifica anteprima':'Edit preview',
'Anteprima modificabile':'Preview is editable',
'Anteprima di sola lettura':'Read-only preview',
'Centra':'Center',
'Centra e ripristina dimensione':'Center and reset zoom',
'Ripristina il testo generato':'Restore generated text',
'Grassetto':'Bold',
'Corsivo':'Italic',
'Trascina per spostare · rotellina o tasti +/− per zoom · Centra per tornare alla mappa':'Drag to pan · use the wheel or +/- keys to zoom · Center to reset',
'Cerchio (testo abbreviato)':'Circle (shortened labels)',
'Area della mappa; trascina per spostare, rotellina per ingrandire; premi Home o 0 per centrare':'Map area; drag to pan, use the wheel to zoom, or press Home or 0 to center',
'Il testo dell’anteprima viene salvato separatamente; gli appunti a sinistra restano invariati.':'Preview edits are saved separately; the notes on the left remain unchanged.',
'Testo modificato nell’anteprima':'Text edited in preview',
'Quando scrivi negli appunti a sinistra, l’anteprima torna ad aggiornarsi e le modifiche manuali a destra vengono sostituite.':'When you edit the notes on the left, the preview updates again and manual changes on the right are replaced.',
'Salva anteprima':'Save preview',
'✨ Sintassi Evidenziatore:':'✨ Highlight syntax:',
'Sintassi testuali:':'Text markers:',
'Sintassi mappa:':'Mind map syntax:'
});
Object.assign(EN,{'Ogni riga con &gt;&gt; ha bisogno di due concetti, uno prima e uno dopo:<br>• Concetto A &gt;&gt; Concetto B':'Every line with &gt;&gt; needs two concepts, one before and one after:<br>• Concept A &gt;&gt; Concept B','Non riesco a disegnare questa mappa: è troppo grande o ha frecce non valide. Prova a dividerla in più note.':'I cannot draw this map: it is too large or has invalid arrows. Try splitting it into several notes.','⛶ Solo mappa':'⛶ Map only','⛶ Solo anteprima':'⛶ Preview only','↩ Vista completa':'↩ Full view','Mostra solo la mappa':'Show only the map',"Mostra solo l'anteprima":'Show only the preview','Torna alla vista completa (Esc)':'Back to full view (Esc)'});
let language='it';
function tr(value){if(language==='en')return EN[value]||value;for(const [it,en] of Object.entries(EN))if(en===value)return it;return value}
function isUserText(node){const p=node.parentElement;return !!p&&!!p.closest('#editor,#text-preview,#map-preview,#simplify-box,#task-list,.lib-item .note-title')}
function localizeNode(node){
if(node.nodeType===Node.TEXT_NODE){if(isUserText(node))return;const old=node.nodeValue||'',trim=old.trim(),translated=tr(trim);if(translated!==trim)node.nodeValue=old.replace(trim,translated);return}
if(node.nodeType!==Node.ELEMENT_NODE)return;
const attrs=['title','placeholder','aria-label'];for(const a of attrs){const v=node.getAttribute(a);if(v){const next=tr(v);if(next!==v)node.setAttribute(a,next)}}
const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);const textNodes=[];while(walker.nextNode())textNodes.push(walker.currentNode);textNodes.forEach(localizeNode)
}
function applyLanguage(root=document.body){if(!root)return;localizeNode(root);root.querySelectorAll('*').forEach(el=>{for(const a of ['title','placeholder','aria-label']){const v=el.getAttribute(a);if(v){const next=tr(v);if(next!==v)el.setAttribute(a,next)}}});const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(localizeNode)}
function changeLanguage(value){flushPreviewEdit();language=value==='en'?'en':'it';try{localStorage.setItem(LANGUAGE_KEY,language)}catch(e){}document.documentElement.lang=language;const s=$('language-select');if(s)s.value=language;const ed=$('editor');if(ed)ed.placeholder=language==='en'?EDITOR_HINT_EN:italianEditorHint;applyLanguage();renderText();mapKey='';renderMap();updateStats();renderLib()}
function watchLanguage(){const observer=new MutationObserver(records=>records.forEach(r=>{if(r.type==='characterData')localizeNode(r.target);else r.addedNodes.forEach(localizeNode)}));observer.observe(document.body,{subtree:true,childList:true,characterData:true})}
const SECS=[['🎯 Motivazione & Produttività',[['useStudyTimer','Timer di studio (Gestione Tempo)'],['useXp','Sistema Livelli ed XP'],['useTasks','Widget Micro-Task (Scomposizione attività)'],['useTts','Pulsante Leggi ad alta voce (voce del browser)']]],['📖 Focus & Leggibilità',[['dyslexia','Modalità Alta Leggibilità'],['ruler','Righello Visivo Sincronizzato'],['focus','Modalità Focus (Nasconde anteprime)'],['blurWrite','Scrittura Libera (Sfoca testo passato)'],['eatToRead','Semplificazione Testo (Sintassi ===)'],['syncScroll','Scorrimento sincronizzato Editor/Anteprima'],['anchor','Lettura ad ancore (prime lettere in grassetto)'],['useReader','Lettura Veloce (pulsante e barra di lettura)'],['mapAutoNext','Mappa (facoltativo): Invio dopo "a &gt;&gt; b" propone "b &gt;&gt; "']]],['🧩 Accessibilità & Comfort Visivo',[['autism','Riduzione Distrazioni Visive (Niente animazioni)']]]];
const TEXTOPTS=[['highlightColon','Evidenzia testo dopo ::'],['highlightComma','Evidenzia in modo discreto il testo dopo ,,'],['highlightNumbers','Evidenzia i numeri degli elenchi (1), 2), 10)…'],['highlightMentions','Evidenzia le menzioni che iniziano con @'],['mood','Riconosci :) e :( come stato del nodo'],['previewEditable','Rendi modificabile l’anteprima a destra']];
const MAPOPTS=[['mapShape','Forma nodi',[['rect','Rettangolo'],['round','Arrotondato'],['stadium','Pillola'],['hex','Esagono'],['circle','Cerchio']]],['mapCurve','Stile linee',[['basis','Curve'],['linear','Dritte'],['step','A gradini']]],['mapPalette','Colori nodi',[['accent','Colore del tema'],['vivid','Vivace'],['pastel','Pastello'],['mono','Monocromatico']]],['mapColorMode','Colora per',[['branch','Ramo (riga)'],['level','Livello'],['single','Tutti uguali']]],['mapLine','Spessore linee',[['1','Sottile'],['2','Normale'],['4','Spesso']]],['mapFont','Testo nodi',[['12','Piccolo'],['15','Normale'],['19','Grande'],['24','Molto grande']]],['mapSpace','Spaziatura',[['compact','Compatta'],['normal','Normale'],['wide','Ampia']]],['mapArrows','Frecce',[['on','Sì'],['off','No']]],['mapMerge','Parole uguali',[['on','Unisci in un nodo'],['off','Tieni separate']]]];
const MAPDEF={mapShape:'rect',mapCurve:'basis',mapPalette:'accent',mapColorMode:'branch',mapLine:2,mapFont:15,mapSpace:'normal',mapArrows:'on',mapMerge:'on'};
const SYSTEM_FONTS=['system-ui, sans-serif','Georgia, serif','ui-monospace, monospace'];
function resetMapOpts(){Object.assign(config,MAPDEF);try{localStorage.setItem('nn_config_v3',JSON.stringify(config))}catch(e){}applyConfig();scheduleMapRefresh(true)}
function initMermaid(){if(typeof mermaid==='undefined')return;const base={compact:[30,40],normal:[50,60],wide:[80,90]}[config.mapSpace]||[50,60],sp=mapDirection==='LR'?[Math.round(base[0]*1.5),Math.round(base[1]*1.8)]:[base[0],Math.round(base[1]*.6)];try{mermaid.initialize({startOnLoad:false,maxTextSize:100000000,maxEdges:1000000,theme:(config.theme==='chiaro'||config.theme==='seppia')?'default':'dark',securityLevel:'strict',themeVariables:{fontSize:config.mapFont+'px',fontFamily:config.font},flowchart:{curve:config.mapCurve,nodeSpacing:sp[0],rankSpacing:sp[1],htmlLabels:false}})}catch(e){console.error(e)}}
document.addEventListener('DOMContentLoaded',function(){
try{const savedLanguage=localStorage.getItem(LANGUAGE_KEY);if(savedLanguage==='en'||savedLanguage==='it')language=savedLanguage}catch(e){}
document.documentElement.lang=language;$('language-select').value=language;italianEditorHint=$('editor').placeholder;if(language==='en')$('editor').placeholder=EDITOR_HINT_EN;
$('toggles').innerHTML=SECS.map(s=>`<div class="setting-section"><h4>${tr(s[0])}</h4>${s[1].map(r=>`<div class="setting-row"><label id="label-${r[0]}" for="chk-${r[0]}">${tr(r[1])}</label><label class="toggle-switch" for="chk-${r[0]}"><input type="checkbox" role="switch" id="chk-${r[0]}" aria-labelledby="label-${r[0]}" onchange="updateConfig('${r[0]}',this.checked)"><span class="slider"></span></label></div>`).join('')}</div>`).join('');
$('text-opts').innerHTML=TEXTOPTS.map(r=>`<div class="setting-row"><label id="label-${r[0]}" for="chk-${r[0]}">${tr(r[1])}</label><label class="toggle-switch" for="chk-${r[0]}"><input type="checkbox" role="switch" id="chk-${r[0]}" aria-labelledby="label-${r[0]}" onchange="updateConfig('${r[0]}',this.checked)"><span class="slider"></span></label></div>`).join('');
$('map-opts').innerHTML=MAPOPTS.map(o=>`<div class="setting-row"><label for="mo-${o[0]}">${tr(o[1])}</label><select id="mo-${o[0]}" class="setting-select" aria-label="${tr(o[1])}" onchange="updateConfig('${o[0]}',this.value)">${o[2].map(v=>`<option value="${v[0]}">${tr(v[1])}</option>`).join('')}</select></div>`).join('');
$('read-opts').innerHTML=READOPTS.map(o=>`<div class="setting-row"><label for="mo-${o[0]}">${tr(o[1])}</label><select id="mo-${o[0]}" class="setting-select" aria-label="${tr(o[1])}" onchange="updateConfig('${o[0]}',this.value)">${o[2].map(v=>`<option value="${v[0]}">${tr(v[1])}</option>`).join('')}</select></div>`).join('');
$('editor').addEventListener('keydown',e=>{if(e.key!=='Enter'||e.shiftKey||e.isComposing||!config.mapAutoNext)return;const t=e.target,p=t.selectionStart;if(p!==t.selectionEnd)return;
const v=t.value,ls=v.lastIndexOf('\n',p-1)+1;let le=v.indexOf('\n',p);if(le<0)le=v.length;if(p!==le)return;
const m=v.slice(ls,le).replace(/^[•\-\*]\s*/,'');if(!m.includes('>>'))return;
const last=m.split('>>').pop().trim();
if(!last){e.preventDefault();t.setRangeText('',ls,le,'end');handleInput();return}
if(last.includes('|'))return;
e.preventDefault();t.setRangeText('\n'+last+' >> ',p,p,'end');handleInput()});
document.addEventListener('keydown',e=>{const target=e.target;if(!readOpen||!target||typeof target.closest!=='function'||target.closest('button,a,input,textarea,select,[contenteditable="true"]')||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;
if(k===' ')toggleRead();else if(k==='ArrowRight')readSeek(1);else if(k==='ArrowLeft')readSeek(-1);else if(k==='ArrowUp')readSpeed(25);else if(k==='ArrowDown')readSpeed(-25);else return;e.preventDefault()});
$('read-bar').addEventListener('click',e=>{const b=e.target.closest('button');if(b)b.blur()});
$('text-preview').addEventListener('click',e=>{if(!readOpen)return;const w=e.target.closest('.w');if(w)readGo(+w.dataset.i,false)});
setupMapNavigation();initMermaid();loadConfig();loadLib();loadState();
$('lib-list').addEventListener('click',e=>{const it=e.target.closest('.lib-item');if(!it)return;const id=it.dataset.id,b=e.target.closest('button');if(!b)return openNote(id);const a=b.dataset.a;if(a==='ren')renameNote(id);else if(a==='dup')dupNote(id);else if(a==='del')delNote(id)});
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('mousedown',e=>{if(e.target===m)closeModal(m.id)}));
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();saveNow();showToast('✔ '+tr('Salvato'))}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='p')e.preventDefault();if(e.key==='Escape'){const open=document.querySelectorAll('.modal.open');if(open.length)open.forEach(m=>closeModal(m.id));else if(viewMode!=='all')setView('all')}});
window.addEventListener('beforeunload',saveNow);window.addEventListener('pagehide',saveNow);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow()});
window.addEventListener('afterprint',()=>{document.body.classList.remove('print-light','printing');if(printMapState){mapZoom=printMapState.zoom;mapPanX=printMapState.panX;mapPanY=printMapState.panY;printMapState=null}mapKey='';renderMap()});
$('editor').addEventListener('input',handleInput);
$('text-preview').addEventListener('input',savePreviewEdit);
$('text-preview').addEventListener('blur',()=>{if(previewEditing)flushPreviewEdit()});
$('text-preview').addEventListener('paste',e=>{if(!previewEditing)return;e.preventDefault();insertPlainPreviewText(e.clipboardData?e.clipboardData.getData('text/plain'):'')});
$('text-preview').addEventListener('dragover',e=>{if(previewEditing)e.preventDefault()});
$('text-preview').addEventListener('drop',e=>{if(!previewEditing)return;e.preventDefault();insertPlainPreviewText(e.dataTransfer?e.dataTransfer.getData('text/plain'):'')});
$('editor').addEventListener('scroll',()=>{if(!config.syncScroll)return;const e=$('editor'),p=$('text-preview');p.scrollTop=e.scrollTop/Math.max(1,e.scrollHeight-e.clientHeight)*(p.scrollHeight-p.clientHeight)});
applyLanguage();watchLanguage();processAll();});
function readMapViewBox(svg){const values=(svg?.getAttribute('viewBox')||'').trim().split(/[\s,]+/).map(Number);return values.length===4&&values.every(Number.isFinite)&&values[2]>0&&values[3]>0?{x:values[0],y:values[1],width:values[2],height:values[3]}:null}
function fitMapToContent(svg){
if(mapBoundsSvg===svg)return true;
const base=mapBaseViewBox,rect=svg?.getBoundingClientRect();if(!base||!rect?.width||!rect.height)return false;
const scale=Math.min(rect.width/base.width,rect.height/base.height);if(!Number.isFinite(scale)||scale<=0)return false;
const left=rect.left+(rect.width-base.width*scale)/2,top=rect.top+(rect.height-base.height*scale)/2;
let minX=base.x,minY=base.y,maxX=base.x+base.width,maxY=base.y+base.height;
svg.querySelectorAll('g.node').forEach(node=>{const box=node.getBoundingClientRect(),x1=base.x+(box.left-left)/scale,x2=base.x+(box.right-left)/scale,y1=base.y+(box.top-top)/scale,y2=base.y+(box.bottom-top)/scale;minX=Math.min(minX,x1);minY=Math.min(minY,y1);maxX=Math.max(maxX,x2);maxY=Math.max(maxY,y2)});
const padding=12/scale;mapBaseViewBox={x:minX-padding,y:minY-padding,width:maxX-minX+padding*2,height:maxY-minY+padding*2};mapBoundsSvg=svg;return true
}
function getMapViewBox(){
const svg=$('map-preview')?.querySelector('svg'),base=mapBaseViewBox;if(!svg||!base)return null;
const viewport=$('map-viewport'),rect=viewport.getBoundingClientRect();if(!rect.width||!rect.height)return null;
const width=base.width/mapZoom,height=base.height/mapZoom,scale=Math.min(rect.width/width,rect.height/height);
if(!Number.isFinite(scale)||scale<=0)return null;
return{x:base.x+(base.width-width)/2-mapPanX/scale,y:base.y+(base.height-height)/2-mapPanY/scale,width,height};
}
function clampMapViewBox(view,rect){
const base=mapBaseViewBox;if(!base||!view||!rect.width||!rect.height)return view;
const scale=Math.min(rect.width/view.width,rect.height/view.height),margin=48/scale;
const minX=Math.min(base.width,margin,view.width),minY=Math.min(base.height,margin,view.height);
const xMin=base.x+minX-view.width,xMax=base.x+base.width-minX;
const yMin=base.y+minY-view.height,yMax=base.y+base.height-minY;
return{...view,x:Math.max(xMin,Math.min(xMax,view.x)),y:Math.max(yMin,Math.min(yMax,view.y))};
}
function zoomMap(d,x,y){
const viewport=$('map-viewport'),svg=$('map-preview')?.querySelector('svg'),base=mapBaseViewBox;if(!viewport||!svg||!base)return;
const rect=viewport.getBoundingClientRect(),current=readMapViewBox(svg);if(!current||!rect.width||!rect.height)return;
const oldScale=Math.min(rect.width/current.width,rect.height/current.height);
const oldLeft=rect.left+(rect.width-current.width*oldScale)/2,oldTop=rect.top+(rect.height-current.height*oldScale)/2;
const clientX=x??rect.left+rect.width/2,clientY=y??rect.top+rect.height/2;
const focusX=current.x+(clientX-oldLeft)/oldScale,focusY=current.y+(clientY-oldTop)/oldScale;
const nextZoom=Math.min(400,Math.max(.1,mapZoom*(1+d*1.5)));if(nextZoom===mapZoom)return;
mapZoom=nextZoom;
const width=base.width/mapZoom,height=base.height/mapZoom,scale=Math.min(rect.width/width,rect.height/height);
const left=rect.left+(rect.width-width*scale)/2,top=rect.top+(rect.height-height*scale)/2;
const next=clampMapViewBox({x:focusX-(clientX-left)/scale,y:focusY-(clientY-top)/scale,width,height},rect);
mapPanX=(base.x+(base.width-width)/2-next.x)*scale;mapPanY=(base.y+(base.height-height)/2-next.y)*scale;
applyMapZoom()
}
function resetZoomMap(){mapZoom=1;mapPanX=0;mapPanY=0;applyMapZoom()}
function applyMapZoom(){
const label=$('map-zoom-label');if(label)label.textContent=`${Math.round(mapZoom*100)}%`;
const viewport=$('map-viewport'),svg=$('map-preview')?.querySelector('svg');if(!viewport||!svg||!fitMapToContent(svg))return;
const view=getMapViewBox();if(!view)return;
const rect=viewport.getBoundingClientRect(),bounded=clampMapViewBox(view,rect);
svg.setAttribute('viewBox',[bounded.x,bounded.y,bounded.width,bounded.height].join(' '));
const scale=Math.min(rect.width/bounded.width,rect.height/bounded.height);
mapPanX=(mapBaseViewBox.x+(mapBaseViewBox.width-bounded.width)/2-bounded.x)*scale;
mapPanY=(mapBaseViewBox.y+(mapBaseViewBox.height-bounded.height)/2-bounded.y)*scale;
}
function setupMapNavigation(){
const v=$('map-viewport');if(!v)return;let drag=null;
v.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,panX:mapPanX,panY:mapPanY};v.classList.add('is-panning');v.setPointerCapture(e.pointerId);e.preventDefault()});
v.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;mapPanX=drag.panX+e.clientX-drag.x;mapPanY=drag.panY+e.clientY-drag.y;applyMapZoom()});
const stop=e=>{if(!drag||drag.id!==e.pointerId)return;drag=null;v.classList.remove('is-panning')};v.addEventListener('pointerup',stop);v.addEventListener('pointercancel',stop);v.addEventListener('lostpointercapture',stop);
v.addEventListener('wheel',e=>{e.preventDefault();if(e.deltaY)zoomMap(e.deltaY<0?.12:-.12,e.clientX,e.clientY)},{passive:false});
v.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){e.preventDefault();zoomMap(.12)}else if(e.key==='-'){e.preventDefault();zoomMap(-.12)}else if(e.key==='0'||e.key==='Home'){e.preventDefault();resetZoomMap()}});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>applyMapZoom()).observe(v);
v.tabIndex=0;applyMapZoom()
}
function loadConfig(){try{const s=JSON.parse(localStorage.getItem('nn_config_v3'));if(s)config={...config,...s}}catch(e){}applyConfig();initMermaid()}
let cfgT,mapT,pendingMapRefresh=false,pendingMermaidConfig=false;
function scheduleMapRefresh(reinitialize=false){pendingMapRefresh=true;pendingMermaidConfig=pendingMermaidConfig||reinitialize;if($('settings-modal')?.classList.contains('open'))return;clearTimeout(mapT);mapT=setTimeout(()=>requestAnimationFrame(()=>{if($('settings-modal')?.classList.contains('open'))return;const shouldInitialize=pendingMermaidConfig;pendingMapRefresh=false;pendingMermaidConfig=false;if(shouldInitialize)initMermaid();renderMap()}),80)}
function flushMapRefresh(){if(pendingMapRefresh)scheduleMapRefresh()}
function updateConfig(k,v){config[k]=v;clearTimeout(cfgT);cfgT=setTimeout(()=>{try{localStorage.setItem('nn_config_v3',JSON.stringify(config))}catch(e){}},250);applyConfig();if(['eatToRead','anchor','anchorLevel','highlightColon','highlightComma','highlightNumbers','highlightMentions','mood'].includes(k))renderText();if(k==='readMode'){syncReader();readApply();if(rPlaying)scheduleReadTick()}if(/^map/.test(k)||k==='mood'||k==='theme'||k==='font')scheduleMapRefresh(['mapCurve','mapFont','mapSpace','theme','font'].includes(k))}
function loadNote(){try{const n=localStorage.getItem('nn_note_content');if(n!==null)$('editor').value=n}catch(e){}}
function scarica(blob,nome){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=nome;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u)}
function salvaManuale(){const ed=$('editor');if(!ed.value.trim()){alert(tr("L'area degli appunti è vuota!"));return}
try{localStorage.setItem('nn_note_content',ed.value)}catch(e){}
scarica(new Blob([ed.value],{type:'text/plain;charset=utf-8'}),'appunti_'+new Date().toISOString().slice(0,10)+'.txt');
createFloatingText('💾 '+tr('File salvato!'),window.innerWidth/2,50,'#00b894')}
function applyConfig(){const b=document.body.classList;if(!['.3','.5','.65'].includes(String(config.anchorLevel)))config.anchorLevel='.5';if(!SYSTEM_FONTS.includes(config.font))config.font=SYSTEM_FONTS[0];if(!['','scifi','notte','foresta','seppia','chiaro'].includes(config.theme))config.theme='';if(!['guide','rsvp'].includes(config.readMode))config.readMode='guide';MAPOPTS.forEach(o=>{if(!o[2].some(v=>String(v[0])===String(config[o[0]])))config[o[0]]=MAPDEF[o[0]]});
b.remove('theme-notte','theme-foresta','theme-seppia','theme-chiaro','theme-scifi');
if(config.theme)b.add('theme-'+config.theme);
b.toggle('focus-mode',config.focus);b.toggle('dyslexia-mode',config.dyslexia);b.toggle('visual-ruler',config.ruler);b.toggle('autism-safe',config.autism);
document.documentElement.style.setProperty('--note-font',config.font);
[...MAPOPTS,...READOPTS].forEach(o=>{const el=$('mo-'+o[0]);if(el)el.value=config[o[0]]});$('sel-theme').value=config.theme;$('sel-font').value=config.font;
['focus','blurWrite','dyslexia','ruler','eatToRead','autism','mood','highlightColon','highlightComma','highlightNumbers','highlightMentions','previewEditable','useStudyTimer','useXp','useTasks','useTts','syncScroll','anchor','useReader','mapAutoNext'].forEach(k=>{const el=$('chk-'+k);if(el)el.checked=!!config[k]});
$('study-timer-box').style.display=config.useStudyTimer?'flex':'none';
$('xp-badge').style.display=config.useXp?'block':'none';
$('btn-tts').style.display=config.useTts?'flex':'none';
$('task-widget').style.display=(config.useTasks&&!config.focus)?'block':'none';
$('btn-blur').style.display=config.blurWrite?'flex':'none';$('btn-anchor').classList.toggle('on',!!config.anchor);$('btn-anchor').setAttribute('aria-pressed',String(!!config.anchor));const rw=$('rb-wpm');if(rw)rw.textContent=getReadWpm();b.toggle('anchor-on',!!config.anchor);$('btn-read').style.display=config.useReader?'flex':'none';if(!config.useReader&&readOpen)toggleReadBar();syncReader();
setPreviewEditing(!!config.previewEditable);
if(!config.blurWrite){b.remove('blur-write');$('editor').classList.remove('blurred');clearTimeout(blurTimer)}}
function closeModal(id){const m=$(id);if(!m)return;m.classList.remove('open');if(id==='settings-modal')flushMapRefresh()}
function toggleModal(id='settings-modal'){const m=$(id);if(!m)return;m.classList.toggle('open');if(id==='lib-modal'&&m.classList.contains('open'))renderLib();if(id==='settings-modal'&&!m.classList.contains('open'))flushMapRefresh()}
let viewMode='all';
function setView(mode){
if(mode!=='map'&&mode!=='preview')mode='all';
viewMode=mode;
const cl=document.body.classList;cl.toggle('view-map-only',mode==='map');cl.toggle('view-preview-only',mode==='preview');
const ex=$('btn-view-exit'),bm=$('btn-view-map'),bp=$('btn-view-preview');
if(ex)ex.hidden=mode==='all';
if(bm){bm.setAttribute('aria-pressed',String(mode==='map'));bm.textContent=tr(mode==='map'?'↩ Vista completa':'⛶ Solo mappa')}
if(bp){bp.setAttribute('aria-pressed',String(mode==='preview'));bp.textContent=tr(mode==='preview'?'↩ Vista completa':'⛶ Solo anteprima')}
if(mode==='map'&&rPlaying)pauseRead();
resetZoomMap();requestAnimationFrame(()=>requestAnimationFrame(applyMapZoom))}
function setMapDir(d){mapDirection=d;initMermaid();resetZoomMap();$('dir-TD').classList.toggle('active',d==='TD');$('dir-LR').classList.toggle('active',d==='LR');processAll()}
function switchMobileTab(tab,ev){document.body.classList.remove('m-tab-editor','m-tab-preview','m-tab-map');document.body.classList.add('m-tab-'+tab);
document.querySelectorAll('.mob-tab-btn').forEach(b=>b.classList.remove('active'));if(ev&&ev.currentTarget)ev.currentTarget.classList.add('active')}
function setPreviewEditing(enabled){const next=!!enabled;if(previewEditing&&!next)flushPreviewEdit();previewEditing=next;const p=$('text-preview'),b=$('preview-toggle'),mode=$('preview-mode');if(!p)return;p.contentEditable=String(previewEditing);p.classList.toggle('is-editable',previewEditing);p.setAttribute('aria-readonly',String(!previewEditing));if(b){b.classList.toggle('on',previewEditing);b.setAttribute('aria-pressed',String(previewEditing));b.textContent=tr(previewEditing?'Anteprima modificabile':'Modifica anteprima')}if(mode)mode.textContent=tr(previewEditing?'Anteprima modificabile':'Anteprima di sola lettura');['preview-bold','preview-italic'].forEach(id=>{const el=$(id);if(el)el.hidden=!previewEditing});const reset=$('preview-reset');if(reset)reset.hidden=!previewEditing}
function togglePreviewEditing(){updateConfig('previewEditable',!config.previewEditable)}
function formatPreview(command){if(!previewEditing)return;$('text-preview').focus();document.execCommand(command,false)}
function safePreviewHtml(value){
const source=document.createElement('template');source.innerHTML=String(value);const allowed=new Set(['DIV','SPAN','BR','B','STRONG','I','EM','U','S','MARK','P','UL','OL','LI','BLOCKQUOTE']),classes=new Set(['callout-box','callout-important','callout-doubt','callout-note','callout-title','c-text','c-important','c-doubt','c-note','hl','hl-comma','hl-number','hl-mention','mood-status','mood-not-understood']);
const clean=node=>{if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.nodeValue||'');if(node.nodeType!==Node.ELEMENT_NODE)return null;if(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','SVG','MATH'].includes(node.tagName))return null;if(!allowed.has(node.tagName))return document.createTextNode(node.textContent||'');const el=document.createElement(node.tagName.toLowerCase());const safe=(node.getAttribute('class')||'').split(/\s+/).filter(c=>classes.has(c));if(safe.length)el.className=safe.join(' ');for(const child of node.childNodes){const result=clean(child);if(result)el.appendChild(result)}return el};
const out=document.createElement('div');for(const child of source.content.childNodes){const result=clean(child);if(result)out.appendChild(result)}return out.innerHTML
}
function flushPreviewEdit(){clearTimeout(previewInputTimer);if(!previewDirty)return;const n=curNote();if(!n){previewDirty=false;return}n.previewHtml=safePreviewHtml($('text-preview').innerHTML);n.previewUpdated=Date.now();n.updated=n.previewUpdated;if(persist())previewDirty=false;else showToast('⚠ '+tr('memoria piena: esporta in .txt ed elimina note vecchie'))}
function savePreviewEdit(){if(!previewEditing)return;previewDirty=true;clearTimeout(previewInputTimer);previewInputTimer=setTimeout(()=>{flushPreviewEdit();updateStats()},350)}
function insertPlainPreviewText(text){if(!text)return;if(document.execCommand('insertText',false,text))return;const selection=window.getSelection();if(!selection||!selection.rangeCount)return;const range=selection.getRangeAt(0);range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range)}
function resetPreview(){clearTimeout(previewInputTimer);previewDirty=false;const n=curNote();if(!n)return;delete n.previewHtml;delete n.previewUpdated;if(!persist())showToast('⚠ '+tr('memoria piena: esporta in .txt ed elimina note vecchie'));renderText()}
function gainXP(a,el){if(!config.useXp)return;xp+=a;
if(xp>=100){level++;xp-=100;createFloatingText(tr('🎉 LIVELLO UP!'),window.innerWidth/2,50,'#00b894')}
saveState();const b=$('xp-badge');b.innerText=`✨ ${tr('Livello')} ${level} (${xp} XP)`;
if(!config.autism){b.style.transform='scale(1.1)';setTimeout(()=>b.style.transform='scale(1)',200)}
if(el&&!config.autism){const r=el.getBoundingClientRect();createFloatingText(`+${a} XP`,r.left+r.width/2,r.top)}}
function createFloatingText(t,x,y,c='#f1c40f'){if(config.autism)return;const e=document.createElement('div');e.className='xp-float';e.innerText=t;e.style.left=x+'px';e.style.top=y+'px';e.style.color=c;document.body.appendChild(e);setTimeout(()=>e.remove(),1000)}
function handleTaskInput(e){if(e.key==='Enter'&&e.target.value.trim()){addTask(e.target.value.trim());e.target.value=''}}
function addTask(t,d,q){const l=$('task-list');if(!l)return;const i=document.createElement('div');i.className='task-item';i.innerHTML='<input type="checkbox" onchange="toggleTask(this)"> <span></span>';i.querySelector('span').textContent=t;if(d){i.classList.add('done');i.querySelector('input').checked=true}l.appendChild(i);if(!q)saveState()}
window.toggleTask=function(c){c.closest('.task-item').classList.toggle('done',c.checked);if(c.checked)gainXP(5,c);saveState()};
function startStudyTimer(min){stopStudyTimer();timeRemaining=min*60;updateTimerDisplay();
studyTimerInterval=setInterval(()=>{timeRemaining--;updateTimerDisplay();if(timeRemaining<=0){stopStudyTimer();alert(tr('Tempo scaduto!'));gainXP(20)}},1000)}
function stopStudyTimer(){clearInterval(studyTimerInterval);timeRemaining=1500;updateTimerDisplay()}
function updateTimerDisplay(){const m=Math.floor(timeRemaining/60).toString().padStart(2,'0'),s=(timeRemaining%60).toString().padStart(2,'0'),el=$('timer-display');if(el)el.innerText=`${m}:${s}`}
function toggleBlur(){$('editor').classList.toggle('blurred');document.body.classList.toggle('blur-write')}
function cancellaTutto(){if(confirm(tr('Vuoi cancellare tutto il testo?'))){$('editor').value='';markDirty();processAll()}}
function leggiTesto(){const p=$('text-preview');if(!p||!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(p.innerText);u.lang=language==='en'?'en-US':'it-IT';window.speechSynthesis.speak(u)}
function discardPreviewOverrideOnSourceEdit(){const note=curNote();if(!note||!note.previewHtml)return;clearTimeout(previewInputTimer);previewDirty=false;delete note.previewHtml;delete note.previewUpdated}
let rafId;function handleInput(){if(rPlaying)pauseRead();discardPreviewOverrideOnSourceEdit();markDirty();cancelAnimationFrame(rafId);rafId=requestAnimationFrame(renderText);clearTimeout(renderTimeout);renderTimeout=setTimeout(renderMap,$('editor').value.length>30000?1500:350)}
function commaStops(rest){
const re=/[.!?](?=\s|$)|,/g;let m;
while((m=re.exec(rest))){
if(m[0]!==',')return m.index;
const prev=rest[m.index-1]||'',next=rest[m.index+1]||'';
if(/\d/.test(prev)&&/\d/.test(next))continue;
return m.index}
return rest.length}
function highlightLine(line){
let out='',pos=0;
while(pos<line.length){
let best=null;
if(config.highlightColon){const i=line.indexOf('::',pos);if(i>=0)best={i,marker:'::',cls:'hl'}}
if(config.highlightComma){const i=line.indexOf(',,',pos);if(i>=0&&(!best||i<best.i))best={i,marker:',,',cls:'hl-comma'}}
if(!best)break;
const start=best.i+best.marker.length,rest=line.slice(start);
let end;
if(best.marker===',,')end=commaStops(rest);else{end=rest.search(/[.!?](?=\s|$)/);if(end<0)end=rest.length}
const phrase=rest.slice(0,end);
out+=line.slice(pos,best.i)+best.marker+(phrase.trim()?' <span class="'+best.cls+'">'+phrase+'</span>':phrase);
pos=start+end}
return out+line.slice(pos)}
function renderText(){
const ed=$('editor'),pv=$('text-preview'),sb=$('simplify-box');if(!ed||!pv)return;
let text=esc(ed.value);
text=text.replace(/^([ \t]*)(\d+)(\)-?|-)([ \t]*)/gm,(match,indent,number,marker,space)=>`${indent}${config.highlightNumbers?'<span class="hl-number">':''}${number})${config.highlightNumbers?'</span>':''}${space}`);
if(config.highlightMentions)text=text.replace(/(^|[\s(\[{«“‘'’,;:]|&quot;)(@[\p{L}\p{N}_]+(?:[-.][\p{L}\p{N}_]+)*)/gu,'$1<span class="hl-mention">$2</span>');
if(config.mood)text=text.replace(/(^|[ \t])(:\)|:\()([.!?]?)(?=[ \t]*$)/gm,(m,space,face,punctuation)=>`${punctuation?'':space}${punctuation}${punctuation?' ':''}<span class="mood-status${face===':('? ' mood-not-understood':''}">${tr(face===':)'?'✓ Capito':'⚠ Non capito')}</span>`);
text=text.split('\n').map(highlightLine).join('\n');
text=text.replace(/^!!!\s*(.*)$/gm,`<div class="callout-box callout-important"><div class="callout-title">${tr('Importante')}</div><div class="c-text c-important">$1</div></div>`);
text=text.replace(/^\?\?\?\s*(.*)$/gm,`<div class="callout-box callout-doubt"><div class="callout-title">${tr('Dubbio')}</div><div class="c-text c-doubt">$1</div></div>`);
text=text.replace(/^i!\s*(.*)$/gm,`<div class="callout-box callout-note"><div class="callout-title">${tr('Nota')}</div><div class="c-text c-note">$1</div></div>`);
let sh='';
if(config.eatToRead){text=text.replace(/^(.*?)\s*===\s*(.*)$/gm,(m,hard,easy)=>{sh+=`<div style="margin-bottom:8px"><strong>${hard.trim()}</strong> ➔ <span style="color:var(--pro-text)">${easy.trim()}</span></div>`;return `<span title="${tr('Semplificato:')} ${easy.trim()}">${hard.trim()}</span>`})}
if(sb){if(sh){sb.innerHTML=`<div class="sb-title">${tr('Semplificazioni')}</div>`+sh;sb.classList.add('visible')}else sb.classList.remove('visible')}
const note=curNote();if(!previewEditing||!pv.contains(document.activeElement))pv.innerHTML=note&&note.previewHtml?safePreviewHtml(note.previewHtml):text;setPreviewEditing(!!config.previewEditable);
const needsAnchor = !!config.anchor || !!readOpen;
pvWords = needsAnchor ? decorateWords(pv, !!config.anchor) : [];
if(readOpen){readApply();if(rPlaying){if(pvWords.length)scheduleReadTick();else pauseRead()}}else{if(curEl)curEl.classList.remove('cur');curEl=null;const box=$('rsvp-box');if(box&&box.children.length>=3){box.children[0].textContent='';box.children[1].textContent='';box.children[2].textContent=''}};
updateStats()}

let mapSeq=0,mapKey='';
const SHAPES={rect:['[',']'],round:['(',')'],stadium:['([','])'],hex:['{{','}}'],circle:['((','))']};
const PALS={vivid:[['#e84393','#fff'],['#0984e3','#fff'],['#00b894','#04251e'],['#fdcb6e','#2d2100'],['#6c5ce7','#fff'],['#e17055','#fff']],pastel:[['#fde2e4','#2b2b2b'],['#dfe7fd','#2b2b2b'],['#e2f0cb','#2b2b2b'],['#fff1c1','#2b2b2b'],['#e8d5f5','#2b2b2b'],['#cdeefd','#2b2b2b']]};
function installSafeMermaidSvg(container, source){
const decoded=document.createElement('textarea');decoded.innerHTML=source;
const doc=new DOMParser().parseFromString(decoded.value,'image/svg+xml'),svg=doc.documentElement;
if(svg.localName!=='svg'||doc.querySelector('parsererror'))throw new Error('Il diagramma restituito non è un SVG valido.');
svg.querySelectorAll('script,foreignObject,iframe,object,embed,image,a').forEach(el=>el.remove());
for(const el of [svg,...svg.querySelectorAll('*')])for(const attr of [...el.attributes]){
if(/^on/i.test(attr.name)||((attr.name==='href'||attr.name==='xlink:href')&&!attr.value.startsWith('#'))||/url\(\s*['"]?\s*(?!#)/i.test(attr.value))el.removeAttribute(attr.name)}
container.replaceChildren(document.importNode(svg,true))}
const mmLabel=s=>String(s).replace(/#/g,'#35;').replace(/&/g,'#38;').replace(/</g,'#60;').replace(/>/g,'#62;').replace(/"/g,'#34;').replace(/\$/g,'#36;').replace(/`/g,'#96;').replace(/\\/g,'#92;');
function renderMap(){
const mp=$('map-preview');if(!mp)return;
const ml=$('editor').value.split('\n').filter(l=>l.includes('>>'));$('map-preview-container').classList.toggle('nomap',!ml.length);
if(!ml.length){++mapSeq;mp.replaceChildren();mapBaseViewBox=null;mapBoundsSvg=null;resetZoomMap();$('map-empty').innerHTML=tr('Usa la sintassi:<br>• Concetto A &gt;&gt; Concetto B<br>• per collegare altro a B scrivi, dove vuoi: B &gt;&gt; C');$('map-empty').hidden=false;mapKey='';return}$('map-empty').hidden=true;
const cv=n=>getComputedStyle(document.body).getPropertyValue(n).trim();
const sh=SHAPES[config.mapShape]||SHAPES.rect,txt=cv('--text-main'),mono=config.mapPalette==='mono';
let pal=PALS[config.mapPalette];if(!pal)pal=[[mono?cv('--bg-toolbar'):cv('--accent'),mono?txt:cv('--on-accent')]];
const mode=config.mapColorMode,arrow=config.mapArrows==='off'?'---':'-->',cls={};
let code=`graph ${mapDirection}\n`;
const ids={},decl={},edges=new Set(),titles={},merge=config.mapMerge!=='off';let nid=0;
const node=(p,li,gi)=>{
const moodMatch=config.mood?p.match(/\s*(:\)|:\()([.!?]?)\s*$/):null;
const mood=moodMatch?moodMatch[1]:'';
const label=mood?p.slice(0,moodMatch.index).trim()+moodMatch[2]:p;
const keyBase=merge?label.toLocaleLowerCase('it-IT'):li+'_'+gi+'_'+label;
const key=keyBase+'_'+mood;
if(ids[key])return ids[key];
const id='n'+(nid++);ids[key]=id;
const k=(mode==='branch'?li:mode==='level'?gi:0)%pal.length;(cls[k]=cls[k]||[]).push(id);
const status=mood===':)'
?'　'+tr('✓ Capito')
:mood===':('
?'　'+tr('⚠ Non capito')
:'';
titles[id]=label+(mood===':)'?' · '+tr('✓ Capito'):mood===':('? ' · '+tr('⚠ Non capito'):'');
let display=label+status;
if(config.mapShape==='circle'){const chars=Array.from(label);display=(chars.length>16?chars.slice(0,15).join('')+'…':label)+(mood===':)'?' ✓':mood===':('? ' ⚠':'')}
display=mmLabel(display);
decl[id]=id+sh[0]+'"'+display+'"'+sh[1];
return id;
};
ml.forEach((line,li)=>{const c=line.replace(/^[•\-\*]\s*/,'').trim();if(!c)return;
const groups=c.split('>>').map(g=>g.split('|').map(p=>p.trim()).filter(Boolean)).filter(g=>g.length);if(groups.length<2)return;
const gid=groups.map((g,gi)=>g.map(p=>node(p,li,gi)));
for(let g=0;g<gid.length-1;g++)gid[g].forEach(a=>gid[g+1].forEach(b=>edges.add(a+' '+arrow+' '+b)))});
if(!edges.size){++mapSeq;mp.replaceChildren();mapBaseViewBox=null;mapBoundsSvg=null;resetZoomMap();$('map-empty').innerHTML=tr('Ogni riga con &gt;&gt; ha bisogno di due concetti, uno prima e uno dopo:<br>• Concetto A &gt;&gt; Concetto B');$('map-empty').hidden=false;mapKey='';return}
code+=Object.values(decl).map(d=>'  '+d).join('\n')+'\n'+[...edges].map(e=>'  '+e).join('\n')+'\n';
Object.keys(cls).forEach(k=>{code+=`  classDef c${k} fill:${pal[k][0]},stroke:${mono?txt:pal[k][0]},color:${pal[k][1]},stroke-width:2px;\n  class ${cls[k].join(',')} c${k};\n`});
code+=`  linkStyle default stroke:${txt},stroke-width:${config.mapLine}px,fill:none;\n`;
const key=code+[config.mapCurve,config.mapFont,config.mapSpace,config.theme,config.font].join('|');
if(key===mapKey||typeof mermaid==='undefined')return;mapKey=key;
const seq=++mapSeq;
return mermaid.render('mm'+seq,code).then(r=>{if(seq!==mapSeq)return;installSafeMermaidSvg(mp,r.svg);const svg=mp.querySelector('svg');if(svg){mapBaseViewBox=readMapViewBox(svg);mapBoundsSvg=null;svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.querySelectorAll('g.node').forEach(group=>{const id=Object.keys(titles).find(key=>group.id.includes('-'+key+'-'));if(!id)return;const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=titles[id];group.insertBefore(title,group.firstChild)})}applyMapZoom()}).catch(e=>{console.error(e);const d=document.getElementById('dmm'+seq);if(d)d.remove();mapKey='';if(seq===mapSeq){mp.replaceChildren();mapBaseViewBox=null;mapBoundsSvg=null;const em=$('map-empty');if(em){em.textContent=tr('Non riesco a disegnare questa mappa: è troppo grande o ha frecce non valide. Prova a dividerla in più note.');em.hidden=false}}})}
const LIBK='nn_lib_v4',STK='nn_state_v1';
let lib={current:null,notes:[]},saveT,dirty=false,saveFailed=false,lastSave=null,toastT;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wc=t=>{t=t.trim();return t?t.split(/\s+/).length:0};
const today=()=>new Date().toISOString().slice(0,10);
const safeName=t=>(t||'appunti').replace(/[\\/:*?"<>|]+/g,'').trim().replace(/\s+/g,'_').slice(0,40)||'appunti';
const curNote=()=>lib.notes.find(n=>n.id===lib.current);
function autoTitle(t){const l=t.split('\n').map(x=>x.replace(/^(!!!|\?\?\?|i!)\s*/,'').replace(/::.*/,'').trim()).find(x=>x);return l?l.slice(0,40):tr('Nuova nota')}
function mkNote(text,title){const t=Date.now();return{id:uid(),title:title||autoTitle(text||''),custom:!!title,text:text||'',created:t,updated:t}}
function persist(){try{localStorage.setItem(LIBK,JSON.stringify(lib));saveFailed=false;return true}catch(e){saveFailed=true;return false}}
function loadLib(){try{const r=JSON.parse(localStorage.getItem(LIBK));if(r&&Array.isArray(r.notes)&&r.notes.length)lib=r}catch(e){}
if(!lib.notes.length){let old='';try{old=localStorage.getItem('nn_note_content')||''}catch(e){}const n=mkNote(old);lib={current:n.id,notes:[n]};persist()}
if(!curNote())lib.current=lib.notes[0].id;$('editor').value=curNote().text}
function setStatus(){}
function markDirty(){dirty=true;updateStats();clearTimeout(saveT);saveT=setTimeout(saveNow,500)}
function saveNow(){clearTimeout(saveT);flushPreviewEdit();const n=curNote();if(!n||!dirty)return;n.text=$('editor').value;n.updated=Date.now();if(!n.custom)n.title=autoTitle(n.text);dirty=!persist();lastSave=new Date();updateStats()}
function updateStats(){const n=curNote(),st=saveFailed?'⚠ '+tr('memoria piena: esporta in .txt ed elimina note vecchie'):dirty?'… '+tr('salvataggio'):'✔ '+tr('salvato')+(lastSave?' '+lastSave.toLocaleTimeString(language==='en'?'en-US':'it-IT',{hour:'2-digit',minute:'2-digit'}):'');$('stats').textContent=`📝 ${wc($('editor').value)} ${tr('parole')} · ${st}`;if(n)$('lib-name').textContent=n.title||tr('Nota')}
function showToast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1800)}
function loadOpen(){$('editor').value=curNote().text;$('editor').scrollTop=0;resetZoomMap();mapKey='';processAll()}
function openNote(id){saveNow();flushPreviewEdit();lib.current=id;persist();loadOpen();toggleModal('lib-modal');showToast('📖 '+curNote().title)}
function newNote(){saveNow();const n=mkNote('');n.title=tr('Nuova nota');lib.notes.push(n);lib.current=n.id;persist();loadOpen();toggleModal('lib-modal');$('editor').focus()}
function renameNote(id){saveNow();const n=lib.notes.find(x=>x.id===id),t=prompt(tr('Nuovo titolo (lascia vuoto per il titolo automatico):'),n.title);if(t===null)return;if(t.trim()){n.title=t.trim().slice(0,80);n.custom=true}else{n.custom=false;n.title=autoTitle(n.text)}persist();renderLib();updateStats()}
function dupNote(id){saveNow();const n=lib.notes.find(x=>x.id===id),c=mkNote(n.text,n.title+' '+tr('(copia)'));if(n.previewHtml)c.previewHtml=n.previewHtml;lib.notes.push(c);persist();renderLib();showToast('⧉ '+tr('Duplicata'))}
function delNote(id){const n=lib.notes.find(x=>x.id===id);if(!confirm(`${tr('Eliminare')} "${n.title}"? ${tr('Non si può annullare.')}`))return;saveNow();lib.notes=lib.notes.filter(x=>x.id!==id);if(!lib.notes.length)lib.notes.push(mkNote(''));if(!curNote()){lib.current=lib.notes[0].id;loadOpen()}persist();renderLib();updateStats()}
function renderLib(){saveNow();const q=($('lib-search').value||'').toLowerCase();
const l=[...lib.notes].sort((a,b)=>b.updated-a.updated).filter(n=>!q||(n.title+' '+n.text).toLowerCase().includes(q));
const locale=language==='en'?'en-US':'it-IT';
$('lib-list').innerHTML=l.length?l.map(n=>`<div class="lib-item${n.id===lib.current?' active':''}" data-id="${esc(String(n.id))}"><div class="t"><span class="note-title">${esc(String(n.title||tr('Senza titolo')))}</span><small>${new Date(n.updated).toLocaleString(locale,{dateStyle:'short',timeStyle:'short'})} · ${wc(n.text)} ${tr('parole')}</small></div><button data-a="ren" title="${tr('Rinomina')}">✎</button><button data-a="dup" title="${tr('Duplica')}">⧉</button><button data-a="del" class="btn-danger" title="${tr('Elimina')}">🗑</button></div>`).join(''):`<div style="opacity:.6;font-size:13px">${tr('Nessuna nota trovata.')}</div>`;
$('lib-info').textContent=`${lib.notes.length} ${tr('note')} · ${tr('salvate in automatico su questo browser')}`}
function getState(){return{xp,level,tasks:[...document.querySelectorAll('#task-list .task-item')].map(i=>({t:i.querySelector('span').textContent,d:i.classList.contains('done')}))}}
function saveState(){try{localStorage.setItem(STK,JSON.stringify(getState()))}catch(e){}}
function setTasks(a){$('task-list').innerHTML='';a.forEach(x=>addTask(x.t,x.d,true))}
function loadState(){try{const s=JSON.parse(localStorage.getItem(STK));if(s){xp=s.xp||0;level=s.level||1;setTasks(s.tasks||[])}}catch(e){}$('xp-badge').innerText=`✨ ${tr('Livello')} ${level} (${xp} XP)`}
function exportTxt(){saveNow();const n=curNote();if(!n.text.trim()){showToast(tr('La nota è vuota'));return}scarica(new Blob([n.text],{type:'text/plain;charset=utf-8'}),safeName(n.title)+'_'+today()+'.txt');showToast(tr('📄 TXT scaricato'))}
const READOPTS=[['anchorLevel','Intensità ancore',[['.3','Leggera (30%)'],['.5','Media (50%)'],['.65','Forte (65%)']]],['readMode','Modalità lettura veloce',[['guide','Guida nel testo'],['rsvp','Una parola alla volta (RSVP)']]]];
let pvWords=[],rIdx=0,rTimer=null,rPlaying=false,readOpen=false,curEl=null,rRamp=0;
function decorateWords(root,anchor){
if(!root)return [];
const ws=[];
root.querySelectorAll('.w').forEach(el=>el.parentNode.replaceChild(document.createTextNode(el.textContent||''),el));
const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
while(walker.nextNode())nodes.push(walker.currentNode);
const re=/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*(?:-[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*)*/gu,lv=parseFloat(config.anchorLevel)||.5;
for(const node of nodes){
if(node.parentElement && node.parentElement.closest('.callout-title'))continue;
const text=node.nodeValue||'';
if(!/[\p{L}\p{N}]/u.test(text))continue;
const frag=document.createDocumentFragment();
let last=0,match;
re.lastIndex=0;
while((match=re.exec(text))){
if(match.index>last)frag.appendChild(document.createTextNode(text.slice(last,match.index)));
const word=match[0],span=document.createElement('span');
span.className='w';span.dataset.i=ws.length;
if(anchor){
const parts=splitGraphemes(word),limit=Math.max(1,Math.ceil(parts.length*lv));
const bold=document.createElement('b');
bold.textContent=parts.slice(0,limit).join('');
span.appendChild(bold);
span.appendChild(document.createTextNode(parts.slice(limit).join('')));
}else{span.textContent=word}
frag.appendChild(span);ws.push(span);last=match.index+word.length;
}
if(last<text.length)frag.appendChild(document.createTextNode(text.slice(last)));
if(node.parentNode)node.parentNode.replaceChild(frag,node);
}
return ws;
}
function splitGraphemes(text){
if(typeof Intl!=='undefined'&&Intl.Segmenter)return [...new Intl.Segmenter('it',{granularity:'grapheme'}).segment(text)].map(x=>x.segment);
return Array.from(text);
}
function getReadWpm(){return Math.min(900,Math.max(100,Number(config.readWpm)||250))}
function readApply(){
if(curEl)curEl.classList.remove('cur');curEl=null;
const p=$('rb-pos');
if(!readOpen || !pvWords.length){
if(p){p.max=0;p.value=0}
updateRsvp();
return;
}
rIdx=Math.min(Math.max(0,rIdx),pvWords.length-1);
curEl=pvWords[rIdx]||null;
if(curEl&&config.readMode!=='rsvp')curEl.classList.add('cur');
if(p){p.max=Math.max(0,pvWords.length-1);p.value=rIdx}
updateRsvp();
}
function updateRsvp(){
const b=$('rsvp-box');
if(!b)return;
const parts=splitGraphemes(curEl?curEl.textContent:'');
const anchor=Math.max(0,Math.min(parts.length-1,Math.ceil(parts.length/3)-1));
const lead=parts.slice(0,anchor).join(''),mid=parts[anchor]||'',trail=parts.slice(anchor+1).join('');
b.children[0].textContent=lead;b.children[1].textContent=mid;b.children[2].textContent=trail;
}
function syncReader(){document.body.classList.toggle('rsvp-on',readOpen&&config.readMode==='rsvp')}
function readScroll(){if(!curEl||config.readMode==='rsvp')return;const pv=$('text-preview'),r=curEl.getBoundingClientRect(),pr=pv.getBoundingClientRect();if(r.bottom>pr.bottom-70||r.top<pr.top+20)pv.scrollTop+=r.top-pr.top-pr.height/3}
function readGo(i,sc=true){
if(!pvWords.length){rIdx=0;return;}
rIdx=Math.min(Math.max(0,+i||0),pvWords.length-1);readApply();if(sc)readScroll();if(rPlaying)scheduleReadTick();
}
function readSeek(d){readGo(rIdx+d)}
function readSpeed(d){updateConfig('readWpm',Math.min(900,Math.max(100,getReadWpm()+d)));if(rPlaying)scheduleReadTick()}
function getReadGap(index){
const current=pvWords[index],next=pvWords[index+1];
if(!current||!next)return '';
const range=document.createRange();
range.setStartAfter(current);range.setEndBefore(next);
return range.toString();
}
function getReadDelay(index){
const word=pvWords[index];if(!word)return 60000/getReadWpm();
const length=splitGraphemes(word.textContent).length,gap=getReadGap(index);
let factor=Math.min(2.5,1+Math.max(0,length-6)*.06-(length<=2?.2:0));
if(/[.!?…]["'”’)\]]*\s*$/u.test(gap))factor+=.8;
else if(/[,;:]["'”’)\]]*\s*$/u.test(gap))factor+=.35;
if(/\n\s*\n/u.test(gap))factor+=1.2;
else if(/\n/u.test(gap))factor+=.35;
factor+=Math.max(0,4-rRamp)*.25;
return 60000/getReadWpm()*factor;
}
function scheduleReadTick(){clearTimeout(rTimer);if(rPlaying)rTimer=setTimeout(readTick,getReadDelay(rIdx))}
function readTick(){
if(!rPlaying || !pvWords.length){pauseRead();return;}
if(rIdx>=pvWords.length-1){pauseRead();return;}
rIdx++;readApply();readScroll();rRamp=Math.min(4,rRamp+1);scheduleReadTick();
}
function toggleRead(){
if(!readOpen || !pvWords.length)return;
if(rPlaying){pauseRead();return;}
if(window.innerWidth<=768){switchMobileTab('preview',null);document.querySelectorAll('.mob-tab-btn').forEach((x,k)=>x.classList.toggle('active',k===1))}
if(rIdx>=pvWords.length-1)rIdx=0;rPlaying=true;rRamp=0;$('rb-play').textContent='⏸';$('rb-play').setAttribute('aria-label',tr('Metti in pausa la lettura'));readApply();readScroll();scheduleReadTick()}
function pauseRead(){rPlaying=false;clearTimeout(rTimer);const b=$('rb-play');if(b){b.textContent='▶';b.setAttribute('aria-label',tr('Avvia la lettura'))}}
function stopRead(){pauseRead();rIdx=0;readApply()}
function toggleReadBar(){
readOpen=!readOpen;
$('read-bar').style.display=readOpen?'flex':'none';
$('btn-read').classList.toggle('on',readOpen);
document.body.classList.toggle('reader-on',readOpen);syncReader();
if(!readOpen){pauseRead();}
renderText();
if(readOpen&&pvWords.length&&config.focus){const pv=$('text-preview');if(pv)pv.scrollTop=0}
}
function insertBranch(){const e=$('editor'),a=e.selectionStart,b=e.selectionEnd,w=e.value.slice(a,b).trim()||tr('Parola');e.setRangeText((a>0&&e.value[a-1]!=='\n'?'\n':'')+w+' >> '+tr('Idea 1')+'\n'+w+' >> '+tr('Idea 2')+'\n',a,b,'end');handleInput();showToast('⑂ '+w+' '+tr('ora ha 2 frecce'))}
function processAll(){renderText();renderMap()}
