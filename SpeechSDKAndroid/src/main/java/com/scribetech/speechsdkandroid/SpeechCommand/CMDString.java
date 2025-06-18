package com.scribetech.speechsdkandroid.SpeechCommand;

import java.util.HashSet;

public class CMDString {
    public static String SELECT_ACTIVE_CHAR = "selectactivechar";
    public static String SELECT_ACTIVE_WORD = "selectactiveword";
    public static String SELECT_ACTIVE_LINE = "selectactiveline";
    public static String SELECT_ACTIVE_PARAGRAPH = "selectactiveparagraph";

    public static String MODIFY = "modify";
    public static String CHOOSE = "choose";
    public static String SELECT = "select";

    public static String SELECT_CHAR = "selectchar";
    public static String SELECT_WORD = "selectword";
    public static String SELECT_LINE = "selectline";
    public static String SELECT_NEXT_LINE = "selectnextline";
    public static String SELECT_PREVIOUS_LINE = "selectpreviousline";
    public static String SELECT_PARAGRAPH = "selectparagraph";

    public static String MARK = "mark";
    public static String GO_TO_LINE_NUMBER = "gotolinenumber";
    public static String GO_TO_PARA_NUMBER = "gotoparanumber";

    public static String SELECT_ALL = "selectall";
    public static String SELECT_NEXT_WORD = "selectnextword";
    public static String SELECT_PREVIOUS_WORD = "selectpreviousword";

    public static String REPLACE = "replace";
    public static String UN_SELECT_IT = "unselectit";
    public static String WHAT_CAN_I_SAY = "whatcanisay";

    // Select Pragraph
    public static String SELECT_PREVIOUS_PARAGRAPH = "selectpreviousparagraph";
    public static String SELECT_NEXT_PARAGRAPH = "selectnextparagraph";
    public static String ALIGN_LEFT = "alignleft";
    public static String ALIGN_RIGHT = "alignright";
    public static String ALIGN_CENTER = "aligncenter";
    public static String ALIGN_JUSTIFY = "alignjustify";

    public static String NUMBER = "number";
    public static String SHOW_LINE_NUMBER = "linenumbershow";
    public static String HIDE_LINE_NUMBER = "linenumberhide";


    public static HashSet<String> SINGLE_IT_CMDs = new HashSet<>();

    public CMDString() {
        SINGLE_IT_CMDs.add("selectit");
        SINGLE_IT_CMDs.add("headerit");
        SINGLE_IT_CMDs.add("cutit");
        SINGLE_IT_CMDs.add("copyit");
        SINGLE_IT_CMDs.add("boldit");
        SINGLE_IT_CMDs.add("unboldit");
        SINGLE_IT_CMDs.add("italiciseit");
        SINGLE_IT_CMDs.add("italicizeit");
        SINGLE_IT_CMDs.add("unitaliciseit");
        SINGLE_IT_CMDs.add("unitalicizeit");
        SINGLE_IT_CMDs.add("underlineit");
        SINGLE_IT_CMDs.add("deunderlineit");
        SINGLE_IT_CMDs.add("ununderlineit");
        SINGLE_IT_CMDs.add("capitaliseit");
        SINGLE_IT_CMDs.add("capitalizeit");
        SINGLE_IT_CMDs.add("uncapitaliseit");
        SINGLE_IT_CMDs.add("uncapitalizeit");
    }

    public static HashSet<String> get_IT_CMDs() {
        return new HashSet<String>(SINGLE_IT_CMDs);
    }

    // Bullet And Number List
    public static String START_NUMBER_LIST = "numberliststart";
    public static String START_BULLET_LIST = "bulletliststart";
    public static String STOP_BULLET_LIST = "bulletliststop";
    public static String STOP_NUMBER_LIST = "numberliststop";

    public static String STOP_LIST = "stoplist";

    //Key Board action
    public static String START_BOLD_TEXT = "startboldtext";
    public static String STOP_BOLD_TEXT = "stopboldtext";
    public static String START_CAPITAL_TEXT = "startcapitaltext";
    public static String STOP_CAPITAL_TEXT = "stopcapitaltext";
    public static String STOP_BULLET_TEXT = "stopbullettext";


    public static String NEXT_LINE = "\n";
    public static String NEXT_LINE_TEXT = "@newline@";
    //Editing your document
    public static String DELETE_IT = "deleteit";
    public static String PASTE_IT = "pasteit";
    public static String COPY_IT = "copyit";
    public static String CUT_IT = "cutit";
    public static String HEADER_IT = "headerit";
    public static String UNDERLINE_IT = "underlineit";
    public static String DE_UNDERLINE_IT = "deunderlineit";

    public static String BOLD_IT = "boldit";
    public static String ITALICIZE_IT = "italicizeit";
    public static String UN_BOLD_IT = "unboldit";
    public static String UNITALICIZE_IT = "unitalicizeit";
    public static String CAPITALIZED_IT = "capitalizeit";
    public static String UN_CAPITALIZED_IT = "uncapitalizeit";
    public static String BULLET_IT = "bulletit";

    public static String BOLD_LAST_LINE = "boldpreviousline";
    public static String BOLD_LAST_WORD = "boldpreviousword";
    public static String DELETE_LAST_LINE = "deletepreviousline";
    public static String DELETE_LAST_WORD = "deletepreviousword";

    public static String UNDO_IT = "undoit";
    public static String REDO_IT = "redoit";

    public static String CLEAR_FIELDS = "clearfields";

    // Combination commands
    public static String BOLD_AND_UNDERLINE = "boldandunderline";

    // Comman start
    public static String GOTO = "goto";
    public static String SELECT1 = "select";
    public static String BOLD = "bold";
    public static String DELETE = "delete";
    public static String UNDERLINE = "underline";
    public static String CAPITALIZE = "capitalize";
    public static String HEADER = "header";
    public static String UNBOLD = "unbold";

    public static String SELECT_FROM_N_TO_M = "Selectfromntom";
    public static String SELECT_N_TO_M = "Selectntom";
    public static String SELECT_N_THROUGH_M = "Selectnthroughm";
    public static String CHOOSE_FROM_N_TO_M = "choosefromnton";
    public static String CHOOSE_N_TO_M = "choosenton";
    public static String MARK_FROM_N_TO_M = "markfromntom";
    public static String MARKNTOM = "marknton";

    //Dynamic Command
    public static String SELECTNEXTNWORDS = "selectnextnwords";
    public static String CHOOSENEXTNWORDS = "choosenextnwords";
    public static String MARKNEXTNWORDS = "marknextnwords";
    public static String SELECTPREVIOUSNWORDS = "selectpreviousnwords";
    public static String CHOOSPREVIOUSNWORDS = "choospreviousnwords";
    public static String MARKPREVIOUSNWORDS = "markpreviousnwords";

    public static String UNSELECTX = "unselectx";
    public static String UNCHOOSEX = "unchoosex";
    public static String UNMARKX = "unmarkx";

    // Comman Key Press
    public static String OK = "ok";
    //public static String OKAY = "okay";
    //public static String ENTER = "enter";
    public static String MOVE_UP = "moveup";
    public static String MOVE_DOWN = "movedown";
    public static String MOVE_LEFT = "moveleft";
    public static String MOVE_RIGHT = "moveright";
    public static String GO_TO_LINE_START = "gotolinestart";
    public static String GO_TO_LINE_END = "gotolineend";
    public static String GIVE_TAB = "givetab";

    public static String GIVE_SPACE = "givespace";
    public static String BACKSPACE = "backspace";
    public static String GO_TO_DOCUMENT_END = "gotodocumentend";
    public static String GO_TO_DOCUMENT_START = "gotodocumentstart";

    public static String GO_TO_NEXT_PAGE = "gotonextpage";
    public static String GO_TO_PREVIOUS_PAGE = "gotopreviouspage";
    public static String INSERT_PAGE_BREAK = "insertpagebreak";

    public static String OPEN_SQUARE_BRACKET = "[";
    public static String CLOSE_SQUARE_BRACKET = "]";
    public static String OPEN_TRI_BRACKET_ = "<";
    public static String CLOSE_TRI_BRACKET = ">";

    // Replace Blank
    public static String REPLACE_BLANKS = "replaceblanks";
    public static String REPLACE_NEXT_BLANK = "nextblank";
    public static String STOP_REPLACING_BLANKS = "stopreplacingblanks";

    //Fields
    public static String NEXT_FIELD = "nextfield";
    public static String PREVIOUS_FIELD = "previousfield";
    public static String SHOW_FIELDS = "showfields";
}