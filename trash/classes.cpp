#include <iostream>
#include <string>
#include <algorithm> 
using namespace std;


// testing: a a,b,c b b,c,d c f,g,h d a,b,c e d,e,f f a,g,h g c,e,g h a,e,g
// more testing: a d b b c c d a e e f f g g h h
bool check(int order[], string blocks[]) {
    int g = 0;
    string leters[8] = { "a", "b", "c", "d", "e", "f", "g", "h" };
    while (g < 8) {
        if (blocks[order[g]].find(leters[g]) == -1) {
            return false;
        }
        g++;
    }
    return true;
}

int main() {
    int i = 0;
    string le[8] = { "a", "b", "c", "d", "e", "f", "g", "h" };
    string classes[8];
    string blocks[8];
    int order[8] = { 0, 1, 2, 3, 4, 5, 6, 7 };
    int combos[8][8] = { 0 };  // Initialize with zero
    string letcom[8][8] = {"z"};
    

    // Input loop (fix: increment `i` after both inputs)
    while (i < 8) {
        cout << "enter the name or your class: ";
        cin >> classes[i];
        cout << "enter the blocks the class is offered separated by commas: ";
        cin >> blocks[i];
        i++;
    }

    // Generates combinations
    i = 0;
    int c = 0, com = 0, b = 0;
       // Generate permutations and check for valid combinations
    
    do {
        if (check(order, blocks)) {
            for (int b = 0; b < 8; ++b) {
                combos[b][com] = order[b];
                letcom[b][com] = classes[order[b]];
            }
            com++;
        }
    } while (next_permutation(order, order + 8));  // Generate next permutation

    cout <<endl<<endl;
    if (com==0){
        cout << "no viable options";
    }else{
    // Output the combinations 
    int g = 0, f = 0;
    while (g < com) {
        f = 0;  // Reset f for inner loop
        while (f < 8) {
            //cout << combos[f][g] << " ";
            letcom[f][g]=classes[combos[f][g]];
            //cout << letcom[f][g] << " ";
            f++;
        }
        cout << endl;
        g++;
    }
    
     g=0, f=0;
    while (g < com) {
        f =0;  // Reset f for inner loop
        cout << "Option "<<(g+1)<<":"<<endl;
        while (f < 8) {
            char n = 'A' + f;
            cout << n<<": "<< letcom[f][g] << endl;
            f++;
        }
        cout << endl;
        g++;
    }
    }
    return 0;
}
