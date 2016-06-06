var meta = null;
var page = null;

var selectedVocabSegment = null;

function parseMeta() {
  meta = JSON.parse($('<span/>').html(window.metaJson).text());
}
function parsePage() {
  page = JSON.parse($('<span/>').html(window.pageJson).text());
}
function parseData() {parseMeta(); parsePage();}

function bindToggleFuriganaHandler() {
  $('.toggle-furigana input').change(toggleFuriganaBlockers);
}

// function adjustInfoTop() {
//   $('.info').css('margin-top', window.scrollY + 'px');
// }

function createFuriganaBlockers() {
  for (var i in page.furigana) {
    var furigana = page.furigana[i];
    $('<div/>', {
      class: 'furigana-blocker',
      style: 'background-color: ' + furigana.color + '; width: ' + furigana.w + '%; height: ' + furigana.h + '%; left: ' + furigana.x + '%; top: ' + furigana.y + '%;',
    }).appendTo($('.scan'));
  }
  toggleFuriganaBlockers();
}

function createVocabSegments() {
  for (var i in page.vocabSegments) {
    var vocabSegment = page.vocabSegments[i];
    $('<label/>', {
      class: 'vocab-segment vocab-segment-' + i,
      style: 'border-color: ' + vocabSegment.color + '; width: ' + vocabSegment.w + '%; height: ' + vocabSegment.h + '%; left: ' + vocabSegment.x + '%; top: ' + vocabSegment.y + '%;',
    })
    .append(
      $('<input/>', {type: 'checkbox'}).change(selectVocabSegment.bind(null, vocabSegment))
    )
    .appendTo($('.scan'));
  }
}

function renderSelectedVocabSegment() {
  if (!!selectedVocabSegment) {
    $('.selected-vocab .jp-common').text(selectedVocabSegment.content.jp.common);
    $('.selected-vocab .jp-kana').text(selectedVocabSegment.content.jp.kana);
    $('.selected-vocab .translation').text(selectedVocabSegment.translation);

    $('.selected-vocab .vocab-list').empty();
    if (selectedVocabSegment.vocab.length > 0) {
      for (var i in selectedVocabSegment.vocab) {
        var vocab = page.vocab[selectedVocabSegment.vocab[i]];
        var li = $('<li/>', {
          class: 'vocab vocab-' + vocab.type
        });
        if (vocab.type == 'kanji') {
          li.append($('<span/>', {class: 'kanji'}).text(vocab.kanji));
          li.append($('<span/>', {class: 'onyomi kunyomi'}).text(vocab.kunyomi.concat(vocab.onyomi).join('・')));
          li.append($('<span/>', {class: 'meaning'}).text(vocab.meanings.join(' / ')));
        } else if (vocab.type == 'word') {
          li.append($('<span/>', {class: 'jp-common'}).text(vocab.jp.common));
          li.append($('<span/>', {class: 'jp-kana'}).text(vocab.jp.kana));
          li.append($('<span/>', {class: 'meaning'}).text(vocab.meanings.join(' / ')));
        }
        li.appendTo($('.selected-vocab .vocab-list'));
      }
    }

    $('.selected-vocab .notes').empty();
    if (selectedVocabSegment.notes.length > 0) {
      $('.selected-vocab .notes').append($('<h3/>', {class: 'notes-title'}).text('Notes'));
      for (var i in selectedVocabSegment.notes) {
        var note = selectedVocabSegment.notes[i];
        $('.selected-vocab .notes').append($('<p/>').text(note));
      }
    }
    $('.selected-vocab').removeClass('hidden');
  } else {
    $('.selected-vocab').addClass('hidden');
  }
}

function deselectVocabSegments() {
  selectedVocabSegment = null;
  renderSelectedVocabSegment();
  $('.vocab-segment').removeClass('selected');
  $('.selected-vocab .jp-kana').empty();
  $('.selected-vocab .translation').empty();
  $('.selected-vocab .vocab-list').empty();
  $('.selected-vocab .notes').empty();
}

function selectVocabSegment(vocabSegment) {
  var selectedAlready = !!selectedVocabSegment && (
    selectedVocabSegment.number == vocabSegment.number
  );
  if (selectedAlready) {
    return deselectVocabSegments();
  }
  selectedVocabSegment = vocabSegment;
  $('.vocab-segment').removeClass('selected');
  $('.vocab-segment-' + vocabSegment.number).addClass('selected');
  renderSelectedVocabSegment();
}

function toggleFuriganaBlockers() {
  $('.furigana-blocker').toggleClass('hidden');
}

$(parseData);
$(bindToggleFuriganaHandler);
$(createFuriganaBlockers);
$(createVocabSegments);
// $(window).scroll(adjustInfoTop);
$(renderSelectedVocabSegment);
