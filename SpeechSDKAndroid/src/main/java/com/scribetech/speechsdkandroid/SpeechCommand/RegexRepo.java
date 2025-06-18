package com.scribetech.speechsdkandroid.SpeechCommand;

import android.util.Log;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Wrapper class that contains all the regex used to determine various commands
 */
public class RegexRepo
{
    //decapitalize|Uncapitalize|Uncap
    private static String ACTION_CMD = "select|choose|copy text|copytext|cut text|cuttext|correct|bold|underline|delete|header|capitalize|unbold|debold|dbold|uncapitalize|remove|capitalise|dcapitalise|decapitalicize|decapitalize|uncapitalize|Uncap|d capitalise|d capitalize|d underline|dunderline|deunderline|ununderline|goto|moveto|move|italicize|italicise|unitalicise|unitalicize";
    // setfontsizeto<n>point |  setfontsizeto<n> | setfontsize<n>;
    public static Pattern SET_FONT_SIZE = Pattern.compile("^setfontsize(to)?([0-9]+)(point[s]?)?$",Pattern.CASE_INSENSITIVE);

    public static Pattern NUMBER_CHOOSE = Pattern.compile("^(number)?([0-9]+|x)[.]?$",Pattern.CASE_INSENSITIVE);

    public static Pattern ACTIVE_X = Pattern.compile("^(" + ACTION_CMD + ")(the)?(active|current)?(word[s]?|line[s]?|sentence[s]?|paragraph[s]?|para[s]?|char[s]?|character[s]?|space|\n\n|\n\ns|\n|\ns)$",Pattern.CASE_INSENSITIVE);

    public static Pattern SELECT_WORD_LINE_NEXT_PREVIOUS = Pattern.compile("^(" + ACTION_CMD + ")(the)?(last|previous|next)(.*?)(word[s]?|line[s]?|sentence[s]?|paragraph[s]?|para[s]?|char[s]?|character[s]?|space|\n\n|\n\ns|\n|\ns)$",Pattern.CASE_INSENSITIVE);

    public static Pattern GO_TO_X = Pattern.compile("^(go|goto|gotothe|move|moveto|movethe)(last|previous|next|down)(.*?)(word[s]?|line[s]?|sentence[s]?|paragraph[s]?|para[s]?|char[s]?|character[s]?|space|\n\n|\n)$",Pattern.CASE_INSENSITIVE);

    //field
    public static Pattern GO_TO_FIELDS = Pattern.compile("^(select|go|goto|gotothe|move|moveto|movethe)?(field[s]?|filled)(number[ed]?)?([0-9]+)$",Pattern.CASE_INSENSITIVE);

    public static Pattern NAVIGATION_WITHOUT_GO_TO = Pattern.compile("^(last|previous|next|down)(.*?)(word[s]?|line[s]?|sentence[s]?|paragraph[s]?|para[s]?|char[s]?|character[s]?|space|\n\n|\n)$",Pattern.CASE_INSENSITIVE);

    //capitaliselast7words
    public static Pattern SELECT_GROUP_2 = Pattern.compile("^(" + ACTION_CMD + ")(\\sthe)?\\s?(.*?)$",Pattern.CASE_INSENSITIVE);

    public static Pattern LINE_PARAGRAPH_NUMBER
            = Pattern.compile("^(" + ACTION_CMD + ")(the)?(line|para|paragraph|\n\n|\n)(number[ed]?)(.*?)(\\.)?$",Pattern.CASE_INSENSITIVE);

    // Dynamic Command
    public static Pattern NEW_LINE_AROUND_SPACE = Pattern.compile("[^\\S\\n]*(\\n+)[^\\S\\n]*", Pattern.CASE_INSENSITIVE);

    public static Pattern REPLACE_X_WITH_Y = Pattern.compile("replace[d]?([A-Z a-z 0-9]+)with([A-Z a-z 0-9]+)", Pattern.CASE_INSENSITIVE);

    public static Pattern REVOVE_SPACE_BEFORE_PUNCTUATION = Pattern.compile("^ ([.|:|,])(.*?)$", Pattern.CASE_INSENSITIVE);
    public static boolean IsNullOrBlank(String param) {
        return param == null || param.trim().length() == 0;
    }
    public static void FillDynamicCommand(ActionRecipe recipe, String cmdtext)
    {
        //Line Action
        Matcher lineSelect = LINE_PARAGRAPH_NUMBER.matcher(cmdtext.trim());
        if (lineSelect.matches() && lineSelect.groupCount() > 3)
        {
            String cmdAction = lineSelect.group(1);
            String lineOrPara = lineSelect.group(3);
            cmdAction = SetActionCommandVarient(cmdAction.toLowerCase());
            int lineNumber = TextWordToInteger.Parse(lineSelect.group(5));
            boolean isValidParams = lineNumber > 0 && !IsNullOrBlank(cmdAction);
            if (isValidParams)
            {
                recipe.Name = ("line".equals(lineOrPara) || "\n".equals(lineOrPara)) ? CMDString.GO_TO_LINE_NUMBER : CMDString.GO_TO_PARA_NUMBER;
                recipe.ChooseNumber = lineNumber;
                recipe.ReceivedText = "";
                recipe.SearchText = lineOrPara;
                recipe.IsCommand = true;
                recipe.SelectFor = CMDString.SELECT.equals(cmdAction) ? "" : cmdAction;
                return;
            }
        }

        if ("goto\n".equals(cmdtext) || "move\n".equals(cmdtext) || "moveto\n".equals(cmdtext))
        {
            // Go to next line
            recipe.Name = CMDString.SELECT_LINE;
            recipe.NextPrevious = "next";
            recipe.ChooseNumber = 1;
            recipe.ReceivedText = "";
            recipe.IsCommand = true;
            recipe.SelectFor = "gotoend";
            return;
        }
        if ("goto\n\n".equals(cmdtext) || "move\n\n".equals(cmdtext) || "moveto\n\n".equals(cmdtext))
        {
            // Go to next line
            recipe.Name = CMDString.SELECT_PARAGRAPH;
            recipe.NextPrevious = "next";
            recipe.ChooseNumber = 1;
            recipe.ReceivedText = "";
            recipe.IsCommand = true;
            recipe.SelectFor = "gotoend";
            return;
        }

        Matcher selectactivex = ACTIVE_X.matcher(cmdtext.trim());
        if (selectactivex.matches() && selectactivex.groupCount() > 4)
        {
            String cmdAction = selectactivex.group(1);
            cmdAction = SetActionCommandVarient(cmdAction);
            String item = selectactivex.group(4).toLowerCase();
            boolean isValidParams = !IsNullOrBlank(item) && !IsNullOrBlank(cmdAction);
            if (isValidParams)
            {
                recipe.Name = SetActiveObjectType(item);
                recipe.ReceivedText = "";
                recipe.SearchText = item;
                recipe.IsCommand = true;
                recipe.SelectFor = CMDString.SELECT.equals(cmdAction) ? "" : cmdAction;
                return;
            }
        }

        Matcher selectNavigationWIthoutGoto = NAVIGATION_WITHOUT_GO_TO.matcher(cmdtext);
        if ((selectNavigationWIthoutGoto.matches() && selectNavigationWIthoutGoto.groupCount() > 3))
        {
            String direction = selectNavigationWIthoutGoto.group(1);
            String item = selectNavigationWIthoutGoto.group(3).toLowerCase();
            recipe.Name = SetSelectObjectType(item);
            recipe.NextPrevious = direction;
            recipe.ChooseNumber = 1;
            recipe.ReceivedText = "";
            recipe.IsCommand = true;
            recipe.SelectFor = ("previous".equals(direction) || "last".equals(direction)) ? "gotostart" : "gotoend";
            return;
        }

        Matcher selectStartOfX = GO_TO_X.matcher(cmdtext);
        if ((selectStartOfX.matches() && selectStartOfX.groupCount()  > 3))
        {
            String cmdAction = selectStartOfX.group(1);
            String direction = selectStartOfX.group(2);
            int wordCount = TextWordToInteger.Parse(selectStartOfX.group(3));
            String item = selectStartOfX.group(4).toLowerCase();
            recipe.Name = SetSelectObjectType(item);
            recipe.NextPrevious = direction;
            recipe.ChooseNumber = wordCount;
            recipe.ReceivedText = "";
            recipe.IsCommand = true;
            recipe.SelectFor = ("previous".equals(direction) || "last".equals(direction)) ? "gotostart" : "gotoend";
            return;
        }

        // Select word for action
        Matcher selectManyWord = SELECT_WORD_LINE_NEXT_PREVIOUS.matcher(cmdtext);
        if (selectManyWord.matches() && selectManyWord.groupCount() > 3)
        {
            String cmdAction = SetActionCommandVarient(selectManyWord.group(1).toLowerCase());
            String direction = selectManyWord.group(3);
            int wordCount = TextWordToInteger.Parse(selectManyWord.group(4));
            wordCount = (wordCount == 0 ? 1 : wordCount);
            String item = selectManyWord.group(5);
            boolean isValidParams = !IsNullOrBlank(item) && !IsNullOrBlank(cmdAction) && !IsNullOrBlank(direction);
            if (isValidParams)
            {
                recipe.Name = SetSelectObjectType(item);
                recipe.NextPrevious = direction;
                recipe.ChooseNumber = wordCount;
                recipe.ReceivedText = "";
                recipe.SearchText = item;
                recipe.IsCommand = true;
                recipe.SelectFor = CMDString.SELECT.equals(cmdAction) ? "" : cmdAction;
                return;
            }
        }

        // Select word for action
        Matcher replace = REPLACE_X_WITH_Y.matcher(recipe.ReceivedText.trim());
        if (replace.matches() && replace.groupCount() == 3)
        {
            recipe.Name = CMDString.REPLACE;
            recipe.SearchText = replace.group(1).trim();
            recipe.SelectFor = replace.group(2).trim();
            recipe.IsCommand = true;
            return;
        }

        Matcher SelectOps = SELECT_GROUP_2.matcher(recipe.ReceivedText.trim());
        if (SelectOps.matches() && SelectOps.groupCount() > 3)
        {
            String cmdAction = SelectOps.group(1);
            //d capitalise|ununderline
            cmdAction = SetActionCommandVarient(cmdAction.toLowerCase());
            String searchText = SelectOps.group(3);
            if (!IsNullOrBlank(searchText))
            {
                recipe.Name = CMDString.SELECT;
                recipe.SearchText = searchText.trim();
                recipe.IsCommand = true;
                recipe.SelectFor = CMDString.SELECT.equals(cmdAction) ? "" : cmdAction;
                return;
            }
        }
        if (recipe.ReceivedText.length() < 12)
        {
            // More than 10 then never be choose command
            Matcher match = NUMBER_CHOOSE.matcher(cmdtext);
            if (match.matches() && match.groupCount() > 2)
            {
                String dig = match.group(2);
                dig = "x".equals(dig) ? "10" : dig;
                recipe.Name = CMDString.NUMBER;
                recipe.ChooseNumber = Integer.parseInt(dig);
                recipe.IsCommand = false; // Will consider this has command only when system is some selection mode otherwise type.
                return;
            }

        }

        if (recipe.Name.startsWith(CMDString.GOTO)|| recipe.Name.startsWith("GO 2")|| recipe.Name.startsWith(CMDString.SELECT1) )
        {
            recipe.Name = CMDString.GOTO;
            recipe.SearchText = recipe.ReceivedText.trim().substring(2);
            recipe.SearchText = recipe.SearchText.trim().substring(2).trim();
            recipe.IsCommand = true;
            return;
        }
    }

    public static void TrimNewLine(ActionRecipe recipe)
    {
        try
        {
            Matcher nlas = NEW_LINE_AROUND_SPACE.matcher(recipe.ReceivedText);
            int i=nlas.groupCount()-1;
            while (nlas.find()) {
                Log.e("nlas : ", nlas.group(1));
                recipe.ReceivedText = recipe.ReceivedText.replace(nlas.group(i), nlas.group(1));
                i++;
            }
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
            Log.e("ErrorVal : ", ex.toString());
        }
    }



    public static String SetActiveObjectType(String item)
    {
        return ("word".equals(item) || "words".equals(item)) ? CMDString.SELECT_ACTIVE_WORD :
                ("line".equals(item) || "lines".equals(item)) ? CMDString.SELECT_ACTIVE_LINE :
                        ("paragraph".equals(item) || "paragraphs".equals(item)) ? CMDString.SELECT_ACTIVE_PARAGRAPH :
                                ("para".equals(item) || "paras".equals(item)) ? CMDString.SELECT_ACTIVE_PARAGRAPH :
                                        ("\n\n".equals(item)) ? CMDString.SELECT_ACTIVE_PARAGRAPH :
                                                ("\n\ns".equals(item)) ? CMDString.SELECT_ACTIVE_PARAGRAPH :
                                                        ("\n".equals(item)) ? CMDString.SELECT_LINE :
                                                                ("\ns".equals(item)) ? CMDString.SELECT_LINE :
                                                                        ("char".equals(item) || "chars".equals(item)) ? CMDString.SELECT_ACTIVE_CHAR :
                                                                                ("space".equals(item)) ? CMDString.SELECT_ACTIVE_CHAR :
                                                                                        ("character".equals(item) || "characters".equals(item)) ? CMDString.SELECT_ACTIVE_CHAR : item;
    }

    public static String SetActionCommandVarient(String cmdAction)
    {
        return "d capitalise".equals(cmdAction) ? "uncapitalize" :
                "d capitalize".equals(cmdAction) ? "uncapitalize" :
                        "decapitalize".equals(cmdAction) ? "uncapitalize" :
                                "dcapitalise".equals(cmdAction) ? "uncapitalize" :
                                        "decapitalicize".equals(cmdAction) ? "uncapitalize" :
                                                "dcapitalize".equals(cmdAction) ? "uncapitalize" :
                                                        "uncapitalize".equals(cmdAction) ? "uncapitalize" :
                                                                "uncap".equals(cmdAction) ? "uncapitalize" :
                                                                        "d underline".equals(cmdAction) ? "deunderline" :
                                                                                "dunderline".equals(cmdAction) ? "deunderline" :
                                                                                        "dunderline".equals(cmdAction) ? "dunderline" :
                                                                                                "ununderline".equals(cmdAction) ? "deunderline" :
                                                                                                        "capitalise".equals(cmdAction) ? "capitalize" :
                                                                                                                "remove".equals(cmdAction) ? "delete" :
                                                                                                                        "goto".equals(cmdAction) ? "gotostart" :
                                                                                                                                "move".equals(cmdAction) ? "gotostart" :
                                                                                                                                        "debold".equals(cmdAction) ? "unbold" :
                                                                                                                                                "dbold".equals(cmdAction) ? "unbold" :
                                                                                                                                                        "cuttext".equals(cmdAction) ? "cut" :
                                                                                                                                                                "cut text".equals(cmdAction) ? "cut" :
                                                                                                                                                                        "copytext".equals(cmdAction) ? "copy" :
                                                                                                                                                                                "copy text".equals(cmdAction) ? "copy" :
                                                                                                                                                                                        "choose".equals(cmdAction) ? "select" :
                                                                                                                                                                                                "italicise".equals(cmdAction) ? "italicize" :
                                                                                                                                                                                                        "unitalicise".equals(cmdAction) ? "unitalicize" :
                                                                                                                                                                                                                "movto".equals(cmdAction) ? "gotostart" : cmdAction;
    }

    public static String SetSelectObjectType(String item)
    {
        return ("word".equals(item) || "words".equals(item)) ? CMDString.SELECT_WORD :
                ("line".equals(item) || "lines".equals(item)) ? CMDString.SELECT_LINE :
                        ("paragraph".equals(item) || "paragraphs".equals(item)) ? CMDString.SELECT_PARAGRAPH :
                                ("para".equals(item) || "paras".equals(item)) ? CMDString.SELECT_PARAGRAPH :
                                        ("\n\n".equals(item)) ? CMDString.SELECT_PARAGRAPH :
                                                ("\n\ns".equals(item)) ? CMDString.SELECT_PARAGRAPH :
                                                        ("\n".equals(item)) ? CMDString.SELECT_LINE :
                                                                ("char".equals(item) || "chars".equals(item)) ? CMDString.SELECT_CHAR :
                                                                        ("space".equals(item)) ? CMDString.SELECT_CHAR :
                                                                                ("character".equals(item) || "characters".equals(item)) ? CMDString.SELECT_CHAR : item;
    }
}
