from project import main

if __name__ == '__main__':
    print "Freezing penguins..."
    main.debug = False
    main.testing = True
    main.freezer.freeze()
    print "Penguins frozen!"
