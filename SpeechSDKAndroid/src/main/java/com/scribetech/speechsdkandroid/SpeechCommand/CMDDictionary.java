package com.scribetech.speechsdkandroid.SpeechCommand;

public class CMDDictionary
{
    public static ActionRecipe Lookup(ActionRecipe recipe)
    {
        //Normalize It, \n Get removed in trim so
        String cmdtext = recipe.ReceivedText.replace("\n", CMDString.NEXT_LINE_TEXT);
        cmdtext = cmdtext.replace(" ", "").toLowerCase().trim();
        cmdtext = cmdtext.replace(CMDString.NEXT_LINE_TEXT, "\n");
        recipe.Name = cmdtext;
        recipe.ReceivedTextWithoutSpace = cmdtext; // Name May modify by dictinary and
        if (recipe.Action!=null && recipe.Action != "")
        {
            recipe.Action = "";
        }
        else
        {
            String cmdAction = recipe.Action.replace("\n", CMDString.NEXT_LINE_TEXT);
            cmdAction = cmdAction.replace(" ", "").toLowerCase().trim();
            cmdAction = cmdAction.replace(CMDString.NEXT_LINE_TEXT, "\n");
            recipe.Action = cmdAction;
        }

        // If IsCommand is true at this point, then the action is a static command
        if (recipe.IsStaticCommand)
        {   // Set static command
            SetSpecialFormat(recipe);
            return recipe;
        }

        // Trim space before and aftet \n
        RegexRepo.TrimNewLine(recipe);

        // Dynamic command
        RegexRepo.FillDynamicCommand(recipe, cmdtext);

        return recipe;

    }

    public static void SetSpecialFormat(ActionRecipe recipe)
    {
        if (CMDString.SELECT_PREVIOUS_WORD.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_WORD;
            recipe.ChooseNumber = 1;
            recipe.NextPrevious = "last";
            recipe.SearchText = "previousword";
            return;
        }
        if (CMDString.SELECT_ALL.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT;
            recipe.SearchText = "all";
            return;
        }
        if (CMDString.SELECT_NEXT_WORD.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_WORD;
            recipe.ChooseNumber = 1;
            recipe.NextPrevious = "next";
            recipe.SearchText = "nextword";
            return;
        }

        if (CMDString.DELETE_LAST_WORD.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_WORD;
            recipe.ChooseNumber = 1;
            recipe.NextPrevious = "previous";
            recipe.SelectFor = "delete";
            return;
        }
        if (CMDString.DELETE_LAST_LINE.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_LINE;
            recipe.ChooseNumber = 1;
            recipe.NextPrevious = "previous";
            recipe.SelectFor = "delete";
            return;
        }
        if (CMDString.BOLD_LAST_WORD.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_WORD;
            recipe.ChooseNumber = 1;
            recipe.NextPrevious = "previous";
            recipe.SelectFor = "bold";
            return;
        }

        if (CMDString.BOLD_LAST_LINE.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_LINE;
            recipe.ChooseNumber = 1;
            recipe.NextPrevious = "previous";
            recipe.SelectFor = "bold";
            return;
        }


        if (CMDString.SELECT_PREVIOUS_PARAGRAPH.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_PARAGRAPH;
            recipe.NextPrevious = "previous";
            recipe.ChooseNumber = 1;
            return;
        }

        if (CMDString.SELECT_NEXT_LINE.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_LINE;
            recipe.NextPrevious = "next";
            recipe.ChooseNumber = 1;
            return;
        }

        if (CMDString.SELECT_PREVIOUS_LINE.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_LINE;
            recipe.NextPrevious = "previous";
            recipe.ChooseNumber = 1;
            return;
        }


        if (CMDString.SELECT_NEXT_PARAGRAPH.equals(recipe.Action))
        {
            recipe.Name = CMDString.SELECT_PARAGRAPH;
            recipe.NextPrevious = "next";
            recipe.ChooseNumber = 1;
            return;
        }

        if (CMDString.BACKSPACE.equals(recipe.Name))
        {
            //ActivateSmartEditorForKeyEventIfNeed(recipe);
            recipe.Name = CMDString.SELECT_CHAR;
            recipe.ChooseNumber = 1;
            recipe.NextPrevious = "previous";
            recipe.SelectFor = "delete";
            return;
        }


    }

}
