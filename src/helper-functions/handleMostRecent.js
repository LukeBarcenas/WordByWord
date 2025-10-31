export function handleMostRecent(totalWordsRead, fastestWpm, textsRead, longestTextReadWords) {

    let words_read_text;
    let wpm_text;
    let texts_read_text;
    let longest_text_text;

    switch(true) {

        case (totalWordsRead < 1000):

            words_read_text = ""
            break

        case (totalWordsRead < 5000 && totalWordsRead >= 1000):

            words_read_text = "First 1000!"
            break

        case (totalWordsRead < 10000 && totalWordsRead >= 5000):

            words_read_text = "Just Read a 5k!"
            break

        case (totalWordsRead < 50000 && totalWordsRead >= 10000):

            words_read_text = "Studious!"
            break

        case (totalWordsRead >= 50000):

            words_read_text = "Bookworm!"
            break

    }

    switch(true) {

        case (fastestWpm < 50 && textsRead >= 1):

            wpm_text = "Took my Time"
            break

        case (fastestWpm > 50 && textsRead >= 1):

            wpm_text = "Fastest Reader Alive"
            break

        default:
            wpm_text = ""   

    }

    switch (true) {

        case (textsRead < 1):

            texts_read_text = ""
            break

        case (textsRead < 10 && totalWordsRead >= 1):

            texts_read_text = "First Chapter"
            break

        case (textsRead < 50 && totalWordsRead >= 10):

            texts_read_text = "Story Time!"
            break

        case (totalWordsRead < 100 && totalWordsRead >= 50):

            texts_read_text = "Page Turner"
            break

        case (totalWordsRead >= 100):

            texts_read_text = "Reader Supreme"
            break

    }

    switch(true) {

        case (longestTextReadWords < 100 && textsRead >= 1):

            longest_text_text = "What Kind of Story was That?"
            break

        case (longestTextReadWords > 1000 && textsRead >= 1):

            longest_text_text = "Finished the Whole Novel!"
            break

        default:
            longest_text_text = ""   

    }



    if(longest_text_text == "") {

        if(texts_read_text == "") {

            if(wpm_text == "") {

                if(words_read_text == "") {

                    words_read_text = "None"
                    return words_read_text

                }

                return words_read_text

            }

            return wpm_text

        }

        return texts_read_text

    } 

    return longest_text_text

}