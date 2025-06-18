#include "Test.h"
#include <cmath>
#include <iostream>

int Test::X = 0;
int Test::index = 0;
int Test::div = 0;
int Test::indexOne = 0;
int Test::indexTwo = 0;
int Test::indexThree = 0;
int Test::indexFour = 0;
std::string Test::displayValue = "";
std::string Test::avgVPT = "";
double Test::p1Value = 0;
double Test::p2Value = 0;
double Test::p3Value = 0;
double Test::p4Value = 0;
double Test::p5Value = 0;
double Test::p6Value = 0;
std::string Test::p1Str = "";
std::string Test::p2Str = "";
std::string Test::p3Str = "";
std::string Test::p4Str = "";
std::string Test::p5Str = "";
std::string Test::p6Str = "";
std::vector<std::string> Test::result;

std::vector<std::string> Test::getTestReport( std::string& data) {

    resetVariables();
    std::vector<std::string> list;
    size_t pos = 0;
    while ((pos = data.find(",")) != std::string::npos) {
        list.push_back(data.substr(0, pos));
        data.erase(0, pos + 1);
    }
    list.push_back(data);

    if(list.size() == 30){
        for (size_t i = 0; i < 20; i += 3) {
            setPositionsVPT25(list[i], list[i + 1], list[i + 2]);
        }
    } else if(list.size() == 40){
        for (size_t i = 0; i < 27; i += 4) {
            setPositionsVPT50(list[i], list[i + 1], list[i + 2], list[i + 3]);
        }
    }



    result.push_back(std::to_string(p1Value));
    result.push_back(std::to_string(p2Value));
    result.push_back(std::to_string(p3Value));
    result.push_back(std::to_string(p4Value));
    result.push_back(std::to_string(p5Value));
    result.push_back(std::to_string(p6Value));
    result.push_back(avgVPT);

    return result;
}

void Test::resetVariables() {
    X = 0;
    index = 0;
    div = 0;
    indexOne = 0;
    indexTwo = 0;
    indexThree = 0;
    indexFour = 0;
    displayValue = "";
    avgVPT = "";
    p1Value = 0;
    p2Value = 0;
    p3Value = 0;
    p4Value = 0;
    p5Value = 0;
    p6Value = 0;
    p1Str = "";
    p2Str = "";
    p3Str = "";
    p4Str = "";
    p5Str = "";
    p6Str = "";
    result.clear();
}

void Test::setPositionsVPT25( std::string& value1,  std::string& value2,  std::string& value3) {
    try {
        indexOne = std::stoi(value1) - 48;
        indexTwo = std::stoi(value2) - 48;
        indexThree = std::stoi(value3) - 48;

        if (value1 == "0") {
            indexOne = 0;
        }

        if (value2 == "0") {
            indexTwo = 0;
        }

        if (value3 == "0") {
            indexThree = 0;
        }

        if (value3 == "0") {
            displayValue = std::to_string(indexOne) + std::to_string(indexTwo);
        } else if (value3 == "0" && value2 == "0") {
            displayValue = std::to_string(indexOne);
        } else {
            displayValue = std::to_string(indexOne) + std::to_string(indexTwo) + std::to_string(indexThree);
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    if (X == 0) {
        X = std::stoi(displayValue);
        return;
    }

    if (index == 0) {
        p1Str = calculateValueVPT25(displayValue);
        p1Value = std::stod(p1Str);
    } else if (index == 1) {
        p2Str = calculateValueVPT25(displayValue);
        p2Value = std::stod(p2Str);
    } else if (index == 2) {
        p3Str = calculateValueVPT25(displayValue);
        p3Value = std::stod(p3Str);
    } else if (index == 3) {
        p4Str = calculateValueVPT25(displayValue);
        p4Value = std::stod(p4Str);
    } else if (index == 4) {
        p5Str = calculateValueVPT25(displayValue);
        p5Value = std::stod(p5Str);
    } else if (index == 5) {
        p6Str = calculateValueVPT25(displayValue);
        p6Value = std::stod(p6Str);
    }

    index += 1;

    float avg = 0.0f;
    div = 0;

    try {
        avg += std::stof(p1Str);
        if (std::stoi(p1Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p2Str);
        if (std::stoi(p2Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p3Str);
        if (std::stoi(p3Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p4Str);
        if (std::stoi(p4Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p5Str);
        if (std::stoi(p5Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p6Str);
        if (std::stoi(p6Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    avgVPT = std::to_string(avg / div);
}

std::string Test::calculateValueVPT25( std::string& value) {
    int result = 0;
    result = ((std::stoi(value) - 100) / (10 + (X / 10) + (X % 10)));
    return std::to_string(result);
}


void Test::setPositionsVPT50( std::string& value1,  std::string& value2,  std::string& value3,  std::string& value4) {
    try {
        indexOne = std::stoi(value1) - 48;
        indexTwo = std::stoi(value2) - 48;
        indexThree = std::stoi(value3) - 48;
        indexFour = std::stoi(value4) - 48;

        if (value1 == "0") {
            indexOne = 0;
        }

        if (value2 == "0") {
            indexTwo = 0;
        }

        if (value3 == "0") {
            indexThree = 0;
        }

        if (value4 == "0") {
            indexFour = 0;
        }

        if (value4 == "0" && value3 == "0" && value2 == "0") {
            displayValue = std::to_string(indexOne);
        } else if (value4 == "0" && value3 == "0") {
            displayValue = std::to_string(indexOne) + std::to_string(indexTwo);
        } else if (value4 == "0") {
            displayValue = std::to_string(indexOne) + std::to_string(indexTwo) + std::to_string(indexThree);
        } else {
            displayValue = std::to_string(indexOne) + std::to_string(indexTwo) + std::to_string(indexThree) + std::to_string(indexFour);
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    if (X == 0) {
        X = std::stoi(displayValue);
        X = X/100;
        return;
    }

    if (index == 0) {
        p1Str = calculateValueVPT50(displayValue);
        p1Value = std::stod(p1Str);
    } else if (index == 1) {
        p2Str = calculateValueVPT50(displayValue);
        p2Value = std::stod(p2Str);
    } else if (index == 2) {
        p3Str = calculateValueVPT50(displayValue);
        p3Value = std::stod(p3Str);
    } else if (index == 3) {
        p4Str = calculateValueVPT50(displayValue);
        p4Value = std::stod(p4Str);
    } else if (index == 4) {
        p5Str = calculateValueVPT50(displayValue);
        p5Value = std::stod(p5Str);
    } else if (index == 5) {
        p6Str = calculateValueVPT50(displayValue);
        p6Value = std::stod(p6Str);
    }

    index += 1;

    float avg = 0.0f;
    div = 0;

    try {
        avg += std::stof(p1Str);
        if (std::stoi(p1Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p2Str);
        if (std::stoi(p2Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p3Str);
        if (std::stoi(p3Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p4Str);
        if (std::stoi(p4Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p5Str);
        if (std::stoi(p5Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    try {
        avg += std::stof(p6Str);
        if (std::stoi(p6Str) != 0) {
            div++;
        }
    } catch (const std::invalid_argument& ia) {
        // Handle parse error.
    }

    avgVPT = std::to_string(avg / div);
}

std::string Test::calculateValueVPT50( std::string& value) {
    int result = 0;
    result = ((std::stoi(value) - 1000) / (10 + (X / 10) + (X % 10)));
    return std::to_string(result);
}
