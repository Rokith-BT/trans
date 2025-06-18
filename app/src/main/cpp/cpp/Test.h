#ifndef TEST_H
#define TEST_H

#include <vector>
#include <string>

class Test {
public:
    static std::vector<std::string> getTestReport( std::string& data);

private:
    static int X;
    static int index;
    static int div;
    static int indexOne;
    static int indexTwo;
    static int indexThree;
    static int indexFour;
    static std::string displayValue;
    static std::string avgVPT;
    static double p1Value;
    static double p2Value;
    static double p3Value;
    static double p4Value;
    static double p5Value;
    static double p6Value;
    static std::string p1Str;
    static std::string p2Str;
    static std::string p3Str;
    static std::string p4Str;
    static std::string p5Str;
    static std::string p6Str;
    static std::vector<std::string> result;

    static void setPositionsVPT25( std::string& value1,  std::string& value2,  std::string& value3);
    static std::string calculateValueVPT25( std::string& value);

    static void setPositionsVPT50( std::string& value1,  std::string& value2,  std::string& value3,  std::string& value4);
    static std::string calculateValueVPT50( std::string& value);

    static void resetVariables();
};

#endif // TEST_H
