package com.scribetech.speechsdkandroid.SpeechCommand;

import java.util.Hashtable;

public class TextWordToInteger {

    private static final Hashtable<String, Integer> WORD_TO_DIGIT = new Hashtable<String, Integer>();

    public TextWordToInteger() {
        WORD_TO_DIGIT.put("zero", 0);
        WORD_TO_DIGIT.put("one", 1);
        WORD_TO_DIGIT.put("two", 2);
        WORD_TO_DIGIT.put("three", 3);
        WORD_TO_DIGIT.put("four", 4);
        WORD_TO_DIGIT.put("five", 5);
        WORD_TO_DIGIT.put("six", 6);
        WORD_TO_DIGIT.put("seven", 7);
        WORD_TO_DIGIT.put("eight", 8);
        WORD_TO_DIGIT.put("nine", 9);
        WORD_TO_DIGIT.put("ten", 10);
        WORD_TO_DIGIT.put("x", 10);
        WORD_TO_DIGIT.put("eleven", 11);
        WORD_TO_DIGIT.put("twelve", 12);
        WORD_TO_DIGIT.put("thirteen", 13);
        WORD_TO_DIGIT.put("fourteen", 14);
        WORD_TO_DIGIT.put("fifteen", 15);
        WORD_TO_DIGIT.put("sixteen", 16);
        WORD_TO_DIGIT.put("seventeen", 17);
        WORD_TO_DIGIT.put("eighteen", 18);
        WORD_TO_DIGIT.put("nineteen", 19);
        WORD_TO_DIGIT.put("twenty", 20);
        WORD_TO_DIGIT.put("twentyone", 21);
        WORD_TO_DIGIT.put("twentytwo", 22);
        WORD_TO_DIGIT.put("twentythree", 23);
        WORD_TO_DIGIT.put("twentyfour", 24);
        WORD_TO_DIGIT.put("twentyfive", 25);
        WORD_TO_DIGIT.put("twentysix", 26);
        WORD_TO_DIGIT.put("twentyseven", 27);
        WORD_TO_DIGIT.put("twentyeight", 28);
        WORD_TO_DIGIT.put("twentynine", 29);
        WORD_TO_DIGIT.put("thirty", 30);
        WORD_TO_DIGIT.put("thirtyone", 31);
        WORD_TO_DIGIT.put("thirtytwo", 32);
        WORD_TO_DIGIT.put("thirtythree", 33);
        WORD_TO_DIGIT.put("thirtyfour", 34);
        WORD_TO_DIGIT.put("thirtyfive", 35);
        WORD_TO_DIGIT.put("thirtysix", 36);
        WORD_TO_DIGIT.put("thirtyseven", 37);
        WORD_TO_DIGIT.put("thirtyeight", 38);
        WORD_TO_DIGIT.put("thirtynine", 39);
        WORD_TO_DIGIT.put("forty", 40);
        WORD_TO_DIGIT.put("fortyone", 41);
        WORD_TO_DIGIT.put("fortytwo", 42);
        WORD_TO_DIGIT.put("fortythree", 43);
        WORD_TO_DIGIT.put("fortyfour", 44);
        WORD_TO_DIGIT.put("fortyfive", 45);
        WORD_TO_DIGIT.put("fortysix", 46);
        WORD_TO_DIGIT.put("fortyseven", 47);
        WORD_TO_DIGIT.put("fortyeight", 48);
        WORD_TO_DIGIT.put("fortynine", 49);
        WORD_TO_DIGIT.put("fifty", 50);
        WORD_TO_DIGIT.put("fiftyone", 51);
        WORD_TO_DIGIT.put("fiftytwo", 52);
        WORD_TO_DIGIT.put("fiftythree", 53);
        WORD_TO_DIGIT.put("fiftyfour", 54);
        WORD_TO_DIGIT.put("fiftyfive", 55);
        WORD_TO_DIGIT.put("fiftysix", 56);
        WORD_TO_DIGIT.put("fiftyseven", 57);
        WORD_TO_DIGIT.put("fiftyeight", 58);
        WORD_TO_DIGIT.put("fiftynine", 59);
        WORD_TO_DIGIT.put("sixty", 60);
        WORD_TO_DIGIT.put("sixtyone", 61);
        WORD_TO_DIGIT.put("sixtytwo", 62);
        WORD_TO_DIGIT.put("sixtythree", 63);
        WORD_TO_DIGIT.put("sixtyfour", 64);
        WORD_TO_DIGIT.put("sixtyfive", 65);
        WORD_TO_DIGIT.put("sixtysix", 66);
        WORD_TO_DIGIT.put("sixtyseven", 67);
        WORD_TO_DIGIT.put("sixtyeight", 68);
        WORD_TO_DIGIT.put("sixtynine", 69);
        WORD_TO_DIGIT.put("seventy", 70);
        WORD_TO_DIGIT.put("seventyone", 71);
        WORD_TO_DIGIT.put("seventytwo", 72);
        WORD_TO_DIGIT.put("seventythree", 73);
        WORD_TO_DIGIT.put("seventyfour", 74);
        WORD_TO_DIGIT.put("seventyfive", 75);
        WORD_TO_DIGIT.put("seventysix", 76);
        WORD_TO_DIGIT.put("seventyseven", 77);
        WORD_TO_DIGIT.put("seventyeight", 78);
        WORD_TO_DIGIT.put("seventynine", 79);
        WORD_TO_DIGIT.put("eighty", 80);
        WORD_TO_DIGIT.put("eightyone", 81);
        WORD_TO_DIGIT.put("eightytwo", 82);
        WORD_TO_DIGIT.put("eightythree", 83);
        WORD_TO_DIGIT.put("eightyfour", 84);
        WORD_TO_DIGIT.put("eightyfive", 85);
        WORD_TO_DIGIT.put("eightysix", 86);
        WORD_TO_DIGIT.put("eightyseven", 87);
        WORD_TO_DIGIT.put("eightyeight", 88);
        WORD_TO_DIGIT.put("eightynine", 89);
        WORD_TO_DIGIT.put("ninety", 90);
        WORD_TO_DIGIT.put("ninetyone", 91);
        WORD_TO_DIGIT.put("ninetytwo", 92);
        WORD_TO_DIGIT.put("ninetythree", 93);
        WORD_TO_DIGIT.put("ninetyfour", 94);
        WORD_TO_DIGIT.put("ninetyfive", 95);
        WORD_TO_DIGIT.put("ninetysix", 96);
        WORD_TO_DIGIT.put("ninetyseven", 97);
        WORD_TO_DIGIT.put("ninetyeight", 98);
        WORD_TO_DIGIT.put("ninetynine", 99);
        WORD_TO_DIGIT.put("onehundred", 100);
    }

    public static int Parse(String word) {
        word = word.replace(" ", "").toLowerCase().trim();
        int result = 0;
        if (word == null || word.length() < 1) {
            return result;
        }

        try {
            result = Integer.parseInt(word);
            return result;
        } catch (NumberFormatException nfe) {
        }

        if (WORD_TO_DIGIT.containsKey(word)) {
            return WORD_TO_DIGIT.get(word);
        }
        return result;
    }
}
